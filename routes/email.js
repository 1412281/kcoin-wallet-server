var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var email = require('../fn/email');
var walletRepo = require('../models/walletRepo');
const USER = 'tranthienhoang14';
const PASSWORD = 'malmalmalmal';

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth:{
        user: USER,
        pass: PASSWORD
    }
}));	

var rand,mailOptions,host,link;

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
            res.redirect('http://localhost:3000/login');
	 	});
	 } else {
             res.redirect('http://localhost:3000/login');

         }
	 });
    res.redirect('http://localhost:3000/login');
});

module.exports = router;
