var express = require('express');
var walletRepo = require('../models/walletRepo');
var utils = require('../fn/utils');
var r = express.Router();
var crypto = require('crypto');
var axios = require('axios');
axios.defaults.baseURL = 'https://api.kcoin.club/';

const key1 = '!@#1';
const key2 = '!@#GF$fgdT%@%$45G';


r.post('/register', function(req, res) {
    //check email if it exists in database
    walletRepo.checkExist(req.body.email).then(function(data){
        console.log(data);
        
        if (data.length > 0) {
            res.status(409);
            res.send('email already exist!');
        }
        else {
            // get publickey, privateKey and Address
           var key = utils.generateAddress();
           var entity = {
                        email: req.body.email,
                        password: myCrypt(req.body.password),
                        publicKey: key.publicKey,
                        privateKey: key.privateKey,
                        address: key.address,
                        balance: 0,
                        isActivated: false
                    }
                    // console.log(entity);
                    //if not exists , send register to database
                    walletRepo.register(entity)
                    .then(function(data) {
                        res.json({address: data.address});
                    })
                    .catch(function(err) {
                        console.log(err);
                        res.status(400);
                    });       
        }
    });
});

r.post('/login', function(req, res) {

    const data = req.body;
    console.log(data);
    var entity = {
        address: data.address,
        password: myCrypt(data.password)
    };
    walletRepo.login(entity).then(function(rows) {
        if (JSON.stringify(rows)=== JSON.stringify([])) {
            res.json({result: 'Login Fail'});
        }

        const data = rows;
        const date_exp = Date.now() + 5;
        const zip = {
            address: data.address,
            date_exp: date_exp
        };
        //console.log(zip);
        const token = createToken(zip);
        res.json({result: 'Login Successful', address: data.address, date_exp: date_exp, token: token});
    });
});

r.get('/existsemail', function(req, res) {
    const data = req.query;
    walletRepo.checkExist(data.email).then(function (data){
        if (data){
            res.status(201);
            res.send("exists");
        } else {
            res.status(200);
            res.send("Available");
        }
        
    });
});

r.get('/checkexist', function(req, res) {
    const data = req.query;
    // console.log(walletRepo.checkExist(data.id));
    walletRepo.checkExist(data.id).then(function (data){

        res.json(data);
    });

});

r.get('/dashboard', function(req,res) {

    const data = req.query;
    const zip = {
        id: data.id,
        date_exp: parseInt(data.date_exp)
    };
    //console.log(zip);

    if (tokenIsAvailable(data.token, zip)) {
        console.log('token correct');

        walletRepo.getDashboard(data.id).then(function (data) {
            console.log(data);
            res.json(data);
        });
    } else {
        console.log('token fail');
        res.end();
    }
});

var tokenIsAvailable = function(req_token, data) {
    if (data.date_exp.valueOf() > Date.now()) {
        console.log('date exp over');
        return false;
    }
    //console.log(req_token);
    //console.log(createToken(data));
    return req_token === createToken(data);
};

var createToken = function(data) {
    //console.log(data);
    //console.log(JSON.stringify(data));

    return myCrypt(JSON.stringify(data) + key1);
};


var myCrypt = function(data) {
    return crypto.createHash('sha1').update(data + key2).digest('hex');
};
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
//

module.exports = r;