var express = require('express');
var transactionRepo = require('../models/transactionRepo');
var r = express.Router();
var q = require('q');
var transfer = require('../fn/transfer');
var block = require('../models/blockRepo');
var userRepo = require('../models/userRepo');

r.post('/createTransaction', function(req, res) {
    const data = req.body;
    const date = new Date(Date.now());

    var entity = {
        coin: data.coin,
        address_send: data.address_send,
        address_receive: data.address_receive,
        date: date
    };

    userRepo.getBalance(data.address_send).then(function (balance) {
        if (balance > data.coin) {res.end("don't enough coin!");}
        
        var walletSend = {
            address: data.address_send,
            balance: +balance - +data.coin
        };
        console.log(walletSend);
        userRepo.updateBabance(walletSend).then(function (result) {
            userRepo.checkExistInDB(data.address_receive).then(function(result) {
                if (result) {
                    userRepo.getBalance(data.address_receive).then(function (balance) {
                        var walletReceive = {
                            address: data.address_receive,
                            balance: +balance + +data.coin
                        };
                        console.log(walletReceive);
                        userRepo.updateBabance(walletReceive).then(function (result) {
                            transactionRepo.createTransactionInSystem(entity).then(function (result) {
                                console.log('send successful!');
                                res.json(result);
                            }).catch(function (err) {
                                console.log(err);
                                res.status(500);
                            });


                        });
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


r.get('/getRencentTransaction', function(req, res) {
    const params = req.query;
    console.log(params);
    transactionRepo.getRecentTrans(params.id, params.limit, params.page).then(function(data){
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