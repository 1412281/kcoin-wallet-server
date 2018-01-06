var express = require('express');
var transactionRepo = require('../models/transactionRepo');
var r = express.Router();
var q = require('q');
var transfer = require('../fn/transfer');
var block = require('../models/blockRepo');
var userRepo = require('../models/userRepo');

r.post('/createTransaction', function (req, res) {
    const data = req.body;
    const date = new Date(Date.now());

    var entity = {
        coin: data.coin,
        email_send: data.email,
        address_receive: data.address_receive,
        date: date
    };
    console.log(entity);
    userRepo.getBalanceUser(data.email).then(function (balance) {
        if (balance > data.coin) {
            res.end("don't enough coin!");
        }

        var walletSend = {
            email: data.email,
            balance: +balance - +data.coin
        };
        userRepo.updateBabance(walletSend.email, walletSend.balance).then(function (result) {
            userRepo.checkExistInDB(data.address_receive).then(function (result) {
                if (result) {
                    userRepo.getInfoByAddress(data.address_receive).then(function (result) {
                        userRepo.updateBabance(result.email, parseInt(result.balance) + +data.coin).then(function (result) {
                            transactionRepo.createTransactionInSystem(entity).then(function (result) {
                                console.log('send successful!');
                                res.json(result);
                            }).catch(function (err) {
                                console.log(err);
                                res.status(500);
                            });
                        })
                    });
                }
                else {
                    transactionRepo.createTransactionSystemOut(entity).then(function (result) {
                        res.json(result);
                    }).catch(function (err) {
                        console.log(err);
                        res.status(500);
                    });
                }
            })

        }).fail(function (err) {
            console.log(err);
        });

    });
});


r.post('/getRencentTransaction', function (req, res) {
    const params = req.body;
    // console.log('aaaaaaaaaaaaa',params);

    transactionRepo.getRecentTrans(params.email, params.limit, params.cursor).then(function (data) {
        console.log(data);
        res.json(data);
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