var express = require('express');
var router = express.Router();
var userRepo = require('../models/userRepo');
var transactionRepo = require('../models/transactionRepo');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/balance', function(req, res){
    var address = req.query.address;
    console.log(address);
    userRepo.getBalance(address).then(function(data){
        res.json(data);
    });

});

router.get('/getAllTransaction', function(req, res) {
    const address = req.query.address;
    transactionRepo.getAllTrans(address).then(function(data){
        res.json(data);
    });

});
module.exports = router;
