var express = require('express');
var transactionRepo = require('../../../Deadline/MyBlockchain - Copy/Server/models/transactionRepo');
var r = express.Router();
var q = require('q');

r.post('/createTransaction', function(req, res) {
    const data = req.body;
    const date = new Date(Date.now()).toMysqlFormat();

    var entity = {
        coin: data.coin,
        wallet_send: data.wallet_send,
        wallet_receive: data.wallet_receive,
        date: date

    };

    transactionRepo.getBalance(data.wallet_send).then(function (row) {
        var walletSend = {
            id: data.wallet_send,
            balance: +row.balance - +data.coin
        };
        console.log(walletSend);
        transactionRepo.updateWallet(walletSend).then(function (row) {

            transactionRepo.getBalance(data.wallet_receive).then(function (row) {
                var walletReceive = {
                    id: data.wallet_receive,
                    balance: +row.balance + +data.coin
                };
                console.log(walletReceive);
                transactionRepo.updateWallet(walletReceive).then(function (row) {


                    transactionRepo.createTransaction(entity).then(function (row) {
                        res.json(row.insertId);
                    }).catch(function (err) {
                        console.log(err);
                        res.status(400);
                    });

                });

            });

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

r.get('/getAllTransaction', function(req, res) {
    const params = req.query;
    transactionRepo.getAllTrans(params.limit, params.page).then(function(data){
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
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

module.exports = r;