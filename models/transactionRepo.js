var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    transfer = require('../fn/transfer'),
    userRepo = require('./userRepo'),
    db = require('../fn/db_firebase');

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
    console.log('create new transaction ',entity);
    db.insert(COLLECTION, '' , entity).then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}

exports.createTransactionSystemOut = function (entity) {
    entity.status = 'processing';
    entity.coin = parseInt(entity.coin);
    var d1 = q.defer();
    var d2 = q.defer();
    var d3 = q.defer();
    transfer.getAllOutputCanUseInSystem().then(function (outputs) {
        // console.log(outputs);
        var value = 0;
        var listOutputWillUse = [];
        outputs.forEach(function (output) {
            if (value < entity.coin) {
                listOutputWillUse.push(output);
                value += output.value;
            }
        });
        console.log('listOutputWillUse', listOutputWillUse);
        d1.resolve(listOutputWillUse);
    });
    d1.promise.then(function (listOutputs) {
        getKeysOfOutputs(listOutputs).then(function (keys) {
            console.log(keys);
            const referenceOutputs = listOutputs.map(function (output) {
                return {
                    hash: output.transaction_hash,
                    value: output.value,
                    index: output.index
                }
            });
            const destinations = [];
            // console.log(entity);
            destinations.push({
                address: entity.address_receive,
                value: entity.coin
            });
            console.log(referenceOutputs);
            console.log(destinations);
            d2.resolve({referenceOutputs: referenceOutputs, keys: keys, destinations: destinations});
        });
    });
    d2.promise.then(function (transferInfo) {
        // console.log(transferInfo);
        transfer.createTransfer(transferInfo.referenceOutputs,transferInfo.keys,transferInfo.destinations).then(function (response) {
            console.log(response.status);
            d3.resolve(response);
        });
    });

    return d3.promise;
};

var getKeysOfOutputs = function(outputs) {

    var keys = [];
    outputs.forEach(function (output) {
        var d1 = q.defer();

        db.load('user', {address: output.address}).then(function (user) {
            const key = {
                privateKey: user[0].privateKey,
                publicKey: user[0].publicKey,
                address: user[0].address
            };
            d1.resolve(key);
        });

        keys.push(d1.promise);

    });

    return q.all(keys);
}
