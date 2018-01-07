var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var adminRepo = require('../models/adminRepo');
var walletRepo = require('../models/walletRepo');

const key1 = '!@#1';
const key2 = '!@#GF$fgdT%@%$45G';

router.post('/login', function(req, res) {
    const data = req.body;
    var entity = {
        email: data.email,
        password: myCrypt(data.password)
    };
    adminRepo.login(entity).then(function(rows) {
        if (JSON.stringify(rows)=== JSON.stringify({})) {
            res.json({result: 'Login Fail'});
        }
        const data = rows;
        const date_exp = Date.now() + 5;
        const zip = {
            email: entity.email,
            date_exp: date_exp
        };
        const token = createToken(zip);
        res.json({result: 'Login Successful', email: entity.email, date_exp: date_exp, token: token});
    });
});

// get block by hash
router.get('/usersbalance', function(req, res) {
    // check token
    var data = req.query;
    const zip = {
        email: data.email,
        date_exp: parseInt(data.date_exp)
    };
    if (!tokenIsAvailable(data.token, zip)){
        res.status  (403) // forbiden
        res.end();
        return;
    }
    console.log(data);
    walletRepo.getAllUsersBalance(0, {}).then(function(alldata){
        var totaluser = alldata.users_balance.length

        var total_balance = 0
        var total_real_balance = 0
        alldata.users_balance.map( function (t) {
            total_balance += parseInt(t.balance)
            total_real_balance += parseInt(t.real_balance)
        })

        walletRepo.getAllUsersBalance(data.limit, JSON.parse(data.cursor)).then(function(data){
            res.json({
                total_user: totaluser,
                total_balance: total_balance,
                total_real_balance: total_real_balance,
               users_balance: data.users_balance,
               cursor: data.cursor,
               next: data.next
            });
        });
    });
});
var tokenIsAvailable = function(req_token, data) {
    return req_token === createToken(data);
};

var createToken = function(data) {
    return myCrypt(JSON.stringify(data) + key1);
};


var myCrypt = function(data) {
    return crypto.createHash('sha1').update(data + key2).digest('hex');
};

module.exports = router;
