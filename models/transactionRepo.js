var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    transfer = require('../fn/transfer'),
    userRepo = require('./userRepo'),
    db = require('../fn/db_firebase');

    var utils = require('../fn/utils');

const COLLECTION = 'transactions';

exports.getAllTrans = function(addressInput) {
    d = q.defer();

    address = "ADD "+ addressInput;
    var listOutput = [];
    var ListBlocks = sync.GetAllBlocks();
    //Search in all Blocks in memory
    // console.log(ListBlocks.length);
    ListBlocks.forEach(function(block){
        block.transactions.forEach(function(transaction) {
            for (i=0; i< transaction.outputs.length; i++) {
                if (transaction.outputs[i].lockScript === address){
                    // save index output and hash of transaction
                    listOutput.push({
                        address: addressInput,
                        transaction_hash: transaction.hash,
                        index: i,
                        value: transaction.outputs[i].value,
                        in_use: false
                    });
                }
            }
        });
    });
    // check in all inputs,
    listOutput.forEach(function(output) {
        ListBlocks.forEach(function(block) {
            block.transactions.forEach(function(transaction) {
                transaction.inputs.forEach( function (input) {
                    if (input.referencedOutputHash === output.transaction_hash && input.referencedOutputIndex === output.index) {
                        output.in_use = true;
                    }
                });
            });
        });
    });

    d.resolve(listOutput);

    return d.promise;
};

exports.getAllUsersTransaction = function (limit, cursor) {
    var d = q.defer();
    console.log(limit)
    console.log(cursor)
    const query = {
        orderBy: {date: 'desc'}, limit: parseInt(limit), cursor: cursor
    };
    db.loadFull(COLLECTION, query).then(function(response) {
        var result = {
            users_transaction: [],
            cursor: response.cursor,
            next: response.next
        };
        response.data.forEach(function (element) {
            result.users_transaction.push(element);
        });
        d.resolve(result);
    });
    return d.promise;
}

exports.getPendingTrans = function () {
    d = q.defer();
    const query = {
        where: {
            status: 'pending'
        },
        orderBy:{
            email_send: 'desc'
        }
    };
    db.loadFull(COLLECTION, query).then(function (response) {
        d.resolve(response.data);
    });
    return d.promise;
};



exports.getRecentTrans = function (email, limit, cursor) {
    d = q.defer();
    const query = {
        where: {
            email_send: email
        },
        orderBy: {
            date: 'desc'
        },
        limit: parseInt(limit),
        cursor: cursor
    };
    // console.log(query);
    db.loadFull(COLLECTION, query).then(function (response) {
        d.resolve(response);
    });
    return d.promise;
};


exports.createTransactionInSystem = function (entity) {
    d = q.defer();
    entity.status = 'pending';
    console.log('--------------------------------------------------------------create new transaction ',entity);
    //hash entity and use it by doc / ID with status = pending
    var str = entity.email_send +entity.address_receive + entity.date + entity.coin;
    console.log(str)
    var hashfromDB = utils.hash(str).toString('hex')
    console.log('Hash DOC of new transaction: ',hashfromDB);

    db.insert(COLLECTION, hashfromDB, entity).then(function (result) {
        console.log(result);
        d.resolve(result);
    })

    return d.promise;
}

exports.createTransactionSystemOut = function (destinations) {

    // console.log('=======create tranasction sys out');
    // console.log(destinations);
    var d1 = q.defer();
    var d2 = q.defer();
    var d3 = q.defer();

    var sum = 0;

    destinations.forEach(function (des) {
        sum += des.value;
    });

    transfer.getAllOutputCanUseInSystem().then(function (outputs) {
        // console.log(outputs);
        var value = 0;
        var listOutputWillUse = [];
        outputs.forEach(function (output) {
            if (value < sum) {
                listOutputWillUse.push(output);
                value += output.value;
            }
        });
        // console.log('listOutputWillUse', listOutputWillUse);
        d1.resolve(listOutputWillUse);
    });
    d1.promise.then(function (listOutputs) {
        // console.log('get key');
        userRepo.getKeysOfOutputs(listOutputs).then(function (keys) {
            // console.log(keys);
            const referenceOutputs = listOutputs.map(function (output) {
                return {
                    hash: output.transaction_hash,
                    value: output.value,
                    index: output.index
                }
            });

            // console.log(referenceOutputs);
            // console.log(destinations);
            d2.resolve({referenceOutputs: referenceOutputs, keys: keys, destinations: destinations});
        });
    });
    d2.promise.then(function (transferInfo) {
        // console.log(transferInfo);
        d3.resolve(transfer.createTransfer(transferInfo.referenceOutputs,transferInfo.keys,transferInfo.destinations));

    });

    return d3.promise;
};



exports.updateTransactionStatus = function (transactionDoc, nextStatus) {
        var d = q.defer();

        db.update(COLLECTION, transactionDoc, {status: nextStatus}).then(function (result) {
            console.log('updated', result)
            d.resolve(result);
        });

        return d.promise;
}


exports.renderTransactionToHashString = function (transaction) {
    //hash entity and use it by doc / ID with status = pending
    var string = transaction.email_send+transaction.address_receive+transaction.date+transaction.coin
    return utils.hash(string).toString('hex')
}

exports.getTransactionByStatus = function (status) {

    return db.load(COLLECTION, {status: status});

};

exports.insertNewTransactionToDB = function (doc, data) {
    return db.insert('newtransaction', doc, data);
};



exports.checkBlockHasTransactionInSystem = function (block) {
    var d = q.defer();
    var d1 = q.defer();

    block.transactions.forEach(function (transaction) {
        var d_listNewTransaction = [];

        d_listNewTransaction.push(db.find('newtransaction', transaction.hash));

        q.all(d_listNewTransaction).then(function (newTransactions) {
            newTransactions.forEach(function (newTransaction) {
                console.log(newTransaction);
                newTransaction.transactions.forEach(function (processingTransaction) {
                    console.log(processingTransaction);
                    db.update(COLLECTION, processingTransaction, {status: 'done'});

                });
                deleteNewTransactionInDB(transaction.hash);

            })
        })
    });
    return d1.promise;

};

var deleteNewTransactionInDB = function (hash) {
    return db.delete('newtransaction', hash);
};

exports.checkBlockHasAddressReceiveInSystem = function (block) {

    var listOutputs = [];

    block.transactions.forEach(function (transactionInBlock) {
        transactionInBlock.outputs.forEach(function(output) {
            listOutputs.push(output);
        });
    });

    var listUsers = [];

    listOutputs.forEach(function (output) {
        const address = output.lockScript.split(' ')[1];
        listUsers.push(db.load('user', {address: address}));
    });
    q.all(listUsers).then(function (users) {
        users.forEach(function (user) {
            if (user[0] !== undefined) {
                console.log(user[0]);
                console.log(listOutputs);
                listOutputs.forEach(function (output) {
                    const address = output.lockScript.split(' ')[1];
                    if (user[0].address === address) {
                        userRepo.updateBabance(user[0].email, parseInt(user[0].balance) + output.value);
                    }
                })
                //
            }
        })
    })

};