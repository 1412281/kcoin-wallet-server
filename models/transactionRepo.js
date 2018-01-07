var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    db = require('../fn/db_firebase');

const COLLECTION = 'transactions';

exports.getAllTrans = function(address) {
    d = q.defer();

    address = "ADD "+ address;
    var listOutput = [];
    var ListBlocks = sync.getAllBlocks();
    //Search in all Blocks in memory
    console.log(ListBlocks.length);
    ListBlocks.forEach(function(block){
        block.transactions.forEach(function(transaction) {
            for (i=0; i< transaction.outputs.length; i++) {
                if (transaction.outputs[i].lockScript === address){
                    // save index output and hash of transaction
                    listOutput.push({
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
            email: email
        },
        limit: parseInt(limit),
        cursor: cursor
    };
    console.log(query);
    db.loadFull(COLLECTION, query).then(function (response) {
        d.resolve(response);
    });
    return d.promise;
};


exports.createTransactionInSystem = function (entity) {
    d = q.defer();
    entity.status = 'done';
    console.log('create new transaction ',entity);
    db.insert(COLLECTION, '' , entity).then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}

exports.createTransactionSystemOut = function (entity) {
    d = q.defer();
    entity.status = 'processing';

    var outputs = findCoinInDB(entity.coin);



    db.insert(COLLECTION,'', entity).then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}

var findCoinInDB = function(value) {
    var result = [];
    var count = 0;
    db.load('store', {}).then(function(outputs) {
        outputs.forEach(function (output) {
            result.push(output);
            count += output.value;
            if (count >= value) {
                d.resolve(result);
                return d.promise;
            }
        })
    });

    return d.promise;
}