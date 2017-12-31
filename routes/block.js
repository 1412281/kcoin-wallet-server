var express = require('express');
var r = express.Router();
var blockRepo = require('../models/blockRepo');

// get all blocks
r.get('', function(req, res) {
    blockRepo.getBlock({}).then(function(data){
        console.log(data.length);
        res.json(data);
    }); 
});

// get block by hash 
r.get('/:hash', function(req, res) {
    var query = {};
    if (req.params.hash != '') 
        query = { hash: req.params.hash};
    blockRepo.getBlock(query).then(function(data){
        console.log(data.length);
        res.json(data);
    });
});

// get wallet account balance base on address
r.get('/balance/:address', function(req, res){
    var address = req.params.address;
    console.log(address);
    blockRepo.getBalance(address).then(function(data){
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