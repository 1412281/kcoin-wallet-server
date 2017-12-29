var express = require('express');
var walletRepo = require('../../../Deadline/MyBlockchain - Copy/Server/models/walletRepo');
var r = express.Router();
var crypto = require('crypto');

const key1 = '!@#1';
const key2 = '!@#GF$fgdT%@%$45G';


r.post('/register', function(req, res) {
    const data = req.body;
    const randomKey = Math.random().toString();
    var entity = {
        email: data.email,
        password: myCrypt(data.password),
        id: myCrypt(data.email + randomKey),
        balance: 1000

    }
    walletRepo.register(entity).then(function(data) {
        res.json({id: entity.id});
    }).catch(function(err) {
        console.log(err);
        res.status(400);
    });

});
r.post('/login', function(req, res) {
    const data = req.body;

    var entity = {
        id: data.id,
        password: myCrypt(data.password)
    };

    walletRepo.login(entity).then(function(rows) {
        //console.log(rows);
        if (JSON.stringify(rows)=== JSON.stringify({})) {
            res.json({result: 'Login Fail'});
        }

        const data = rows;
        const date_exp = Date.now() + 5;
        const zip = {
            id: data.id,
            date_exp: date_exp
        };
        //console.log(zip);
        const token = createToken(zip);
        res.json({result: 'Login Successful', id: data.id, date_exp: date_exp, token: token});

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
    console.log(data);
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