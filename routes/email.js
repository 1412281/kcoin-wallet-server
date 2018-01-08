var express = require('express');
var router = express.Router();
var email = require('../fn/email');
var walletRepo = require('../models/walletRepo');
const CLIENT_HOST = 'https://1412281.github.io/kcoin-wallet-client/'

router.get('/verify', function(req, res, next) {
	//get waiting email corresponding with id number
	 email.verify(req.query.address).then(function(waiting_email){
	 	 console.log(waiting_email);
	 	 if (waiting_email !== '') {
	 	// update Activated status of email after verify
	 	var newvalues = {
	 			isActivated: true
	 	};
	 	walletRepo.updateWallet(waiting_email, newvalues).then(function(data){
            res.redirect(CLIENT_HOST+'/login');
	 	});
	 } else {
             res.redirect(CLIENT_HOST+'/login');
         }
	 });
    res.redirect(CLIENT_HOST+'/login');
});

router.get('/transactionconfirm', function (req, res) {
	console.log(req.query.hash)
	email.transactionConfirm(req.query.hash).then(function (data) {
		if (data)
            res.redirect(CLIENT_HOST+'/dashboard');
    })
})

module.exports = router;
