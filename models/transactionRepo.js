var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    db = require('../fn/db_mongodb');

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


exports.createTransactionInSystem = function (entity) {
    d = q.defer();

    db.insert(entity, 'transactions').then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}

exports.createTransactionSystemOut = function (entity) {
    d = q.defer();

    db.insert(entity, 'transactions').then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}

