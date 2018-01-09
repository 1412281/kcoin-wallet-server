const q = require('q');
const db = require('./db_firebase');
const transactionRepo = require('../models/transactionRepo');
const userRepo = require('../models/userRepo');
const utils = require('./utils');
const transfer = require('./transfer');

const COIN_MIN = 1000;
const NUMBER_OF_OUTPUT_NEED = 10;
const ADDRESS_CHILD = 'da0214e8d3317edfc1aa6df914d4c14bfd17cc55a10f74ea4b17124006991335';

exports.initListener = function () {
    setInterval(function () {
        createOutput().then(function (res) {
            console.log(res);
        });
    }, 30000);

    setInterval(function () {
        createTransferWaitingTransaction().then(function (res) {
            console.log(res);
        });
    }, 30000)
};

//auto create out put
//listener transaction is waiting


var createOutput = function () {
    console.log('=======AUTO CREATE OUTPUTS==========');
    var d = q.defer();
    var d_outputOnSystem = q.defer();
    var d_listOutputWillUse = q.defer();
    var d_getKeysOfOutputs = q.defer();
    var d_createUsers = q.defer();
    var d_numberDes = q.defer();
    const q1 = require('q');
    db.load('output', {}).then(function (outputs) {
        d_outputOnSystem.resolve(outputs);
    });


    d_outputOnSystem.promise.then(function (outputs) {
        // console.log('output length', outputs);

        if (outputs.length < NUMBER_OF_OUTPUT_NEED && outputs.length > 5) {
            var sum = 0;
            var referenceOutputs = [];
            outputs.forEach(function (output) {
                if (output.value > COIN_MIN) {
                    referenceOutputs.push({
                        hash: output.transaction_hash,
                        value: output.value,
                        index: output.index,
                        address: output.address
                    });
                    sum += output.value;
                }
            });
            d_listOutputWillUse.resolve(referenceOutputs);
            d_numberDes.resolve(sum/COIN_MIN - 1);
        }
    });
    d_listOutputWillUse.promise.then(function (outputs) {
        // console.log(outputs);
        userRepo.getKeysOfOutputs(outputs).then(function (keys) {
            // console.log('keys', keys);
            d_getKeysOfOutputs.resolve(keys);
        });
    });

    // d_numberDes.promise.then(function (sum) {
    //     console.log(sum);
    //     var maxUsers = sum / COIN_MIN;
    //     var users = [];
    //     for (var i = 0; i < maxUsers - 1; i++) {
    //         users.push(createAnonymousUser());
    //     }
    //     d_createUsers.resolve(q1.all(users));
    // });

    q.all([d_listOutputWillUse.promise, d_getKeysOfOutputs.promise, d_numberDes.promise]).then(function (data) {
        console.log(data);
        var referencOutputs = [];
        data[0].forEach(function (output) {
            referencOutputs.push({
                hash: output.hash,
                value: output.value,
                index: output.index
            });
        });
        var keys = [];
        data[1].forEach(function (key) {
            keys.push({
                privateKey: key.privateKey,
                publicKey: key.publicKey,
                address: key.address
            })
        });
        const numberOfDes = data[2];
        var destinations = [];
        for(var i = 0; i < numberOfDes; i++) {
            destinations.push({
                address: ADDRESS_CHILD,
                value: COIN_MIN
            })
        }

        transfer.createTransfer(referencOutputs, keys, destinations).then(function (result) {
            console.log(result.status);
            console.log(result.data);
            if (result.status === 200) {
                referencOutputs.forEach(function (output) {
                    db.delete('output', output.transaction_hash);
                });
                d.resolve(result);
            }
            else {
                d.resolve(result.status);
            }
        });

    })

    return d.promise;

};

// var createAnonymousUser = function () {
//     var d = q.defer();
//     var key = utils.generateAddress();
//     db.insert('key', key.address, key).then(function (result) {
//         d.resolve(key.address);
//     });
//     return d.promise;
// };

//listener transaction is waiting
var createTransferWaitingTransaction = function () {
    console.log('=========CREATE TRANSFER WAITING TRANSACTION=============');
    var d = q.defer();
    transactionRepo.getTransactionByStatus('waiting').then(function (transactions) {
        if (transactions.length === 0) {
            d.reject("DON'T HAVE WAITING TRANSACTION");
        }
        else {
            var listTransactionDocs = [];
            transactions.forEach(function (transaction) {
                listTransactionDocs.push(transactionRepo.renderTransactionToHashString(transaction));
            });
            // console.log('d_listTransaction',transactions)
            var destinations = [];
            transactions.forEach(function (transaction) {
                destinations.push({
                    address: transaction.address_receive,
                    value: parseInt(transaction.coin)
                });
            });
            // console.log(destinations);
            console.log(listTransactionDocs);
            d.resolve(transactionRepo.createTransactionSystemOut(destinations).then(function (resTransaction) {
                console.log(resTransaction);
                transactionRepo.insertNewTransactionToDB(resTransaction.data.hash, {transactions: listTransactionDocs}).then(function (result) {
                    listTransactionDocs.forEach(function (doc) {
                        transactionRepo.updateTransactionStatus(doc, 'processing');

                    });
                });

            }));


        }
    });

    return d.promise;
};

