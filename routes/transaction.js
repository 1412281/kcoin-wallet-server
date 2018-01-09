var express = require('express');
var transactionRepo = require('../models/transactionRepo');
var r = express.Router();
var q = require('q');
var transfer = require('../fn/transfer');
var block = require('../models/blockRepo');
var userRepo = require('../models/userRepo');
var db = require('../fn/db_firebase');
var email = require('../fn/email');

r.post('/createTransaction', function (req, res) {
    const data = req.body;
    const date = new Date(Date.now());
    var entity = {
        coin: data.coin.toString(),
        email_send: data.email,
        address_receive: data.address_receive,
        date: date.toISOString()
    };
    console.log(entity);
    var d1_checkBalanceAndGetWalletSend = q.defer();
    var d2_checkAddressReceiveInSystem = q.defer();
    var d3_createTransactionInSystem = q.defer();
    var d_updateBalanceUserSend = q.defer();

    userRepo.getBalanceUser(data.email).then(function (balance) {
        if (parseInt(balance) < parseInt(data.coin)) {
            res.end("don't enough coin!");
            d1_checkBalanceAndGetWalletSend.reject();
            d2_checkAddressReceiveInSystem.reject();
        }
        else {
            var walletSend = {
                email: data.email,
                balance: parseInt(balance) - +data.coin
            };
            d1_checkBalanceAndGetWalletSend.resolve(walletSend);
        }

    });

    d1_checkBalanceAndGetWalletSend.promise.then(function (walletSend) {
        console.log('have d1_checkBalanceAndGetWalletSend');
        userRepo.updateBabance(walletSend.email, walletSend.balance).then(function (result) {
            d_updateBalanceUserSend.resolve(result);
        });
        userRepo.checkExistInDB(data.address_receive).then(function (addressReceiveIsInSystem) {
            d2_checkAddressReceiveInSystem.resolve(addressReceiveIsInSystem);
        });
    });

    d2_checkAddressReceiveInSystem.promise.then(function (addressReceiveIsInSystem) {
        console.log('have d2_checkAddressReceiveInSystem');
        if (addressReceiveIsInSystem) {
            // userRepo.getInfoByAddress(data.address_receive).then(function (infoAddressReceive) {
            //     d3_getInfoReceive.resolve(infoAddressReceive)
            // });
            console.log('address Receive Is System IN');

            entity.system = 'in';
            transactionRepo.createTransactionInSystem(entity).then(function (result) {
                d3_createTransactionInSystem.resolve(result);
            });
            q.all([d_updateBalanceUserSend, d3_createTransactionInSystem]).then(function (result) {
                console.log('send successful in system!');
                email.sendEmailTransactionConfirm(entity);
                res.json(result);
            });
        }
        else {
            console.log('address Receive Is System Out');
            entity.system = 'out';
            transactionRepo.createTransactionInSystem(entity).then(function (result) {
                d3_createTransactionInSystem.resolve(result);
            });

            q.all([d_updateBalanceUserSend, d3_createTransactionInSystem]).then(function (result) {
                console.log('send successful out system!');
                email.sendEmailTransactionConfirm(entity);
                res.json(result);
            });
            // transactionRepo.createTransactionSystemOut(entity).then(function (result) {
            //     console.log('-------SEND OUT SYSTEM---------');
            //     console.log(result.status);
            //     console.log(result.data);
            //     console.log(result.statusText === 'OK');
            //     if (result.status === 200 || result.statusText === 'OK') {
            //         deleteOutput(result.data.inputs).then(function(result){
            //                  res.json(result.data);
            //          });

            //
            //     }
        }
    });


});

var deleteOutput = function(inputs) {
    inputs.forEach(function (input) {
        db.delete('output', input.referencedOutputHash + input.referencedOutputIndex.toString()).then(function (res) {
            console.log('delete', res);
        });
    });
};


var addOutput = function(transaction) {
    const outputs = transaction.outputs;
    console.log('Add output');
    var exists = [];
    outputs.forEach(function (output, index) {
        var d = q.defer();

        const address = output.lockScript.split(' ')[1];
        console.log(address);
        userRepo.checkExistInDB(address).then(function (result) {
            console.log(address);
            if (result) {
                const obj = {
                    transaction_hash: transaction.hash,
                    is_use: false,
                    address: outputs[index].lockScript.split(' ')[1],
                    value: outputs[index].value,
                    index: index
                }
                db.insert('output', transaction.hash + index.toString(), obj).then(function (res) {
                    console.log('success')
                });
            }

        });

    });


};


r.post('/getRencentTransaction', function (req, res) {
    const params = req.body;
    // console.log('aaaaaaaaaaaaa',params);

    transactionRepo.getRecentTrans(params.email, params.limit, params.cursor).then(function (data) {
        console.log(data);
        res.json(data);
    });
});

r.get('/:hash', function (req, res) {
    const transactionHash = req.params.hash;

    transactionRepo.getTransactionOnBlockchainByHash(transactionHash).then(function (result) {
        // console.log(result);
        res.json(result);
    });
});
//
// r.put('/', function(req, res) {
//     console.log(req.body);
//     walletRepo.update(req.body).then(function(data) {
//         res.json({ status: 200 });
//     })
// });
//
// r.delete('/', function(req, res) {
//     walletRepo.delete(req.body).then(function(data) {
//         res.json({ status: 200 });
//     }).catch(function(err) {
//         console.log(err);
//         res.end('delete fail');
//     });
// });
module.exports = r;