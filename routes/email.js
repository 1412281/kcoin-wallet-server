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
	 email.verify(req.query.id).then(function(waiting_email){
	 	 console.log(waiting_email);
	 	 if (waiting_email != '') {
	 	// update Activated status of email after verify
	 	let query = {
	 		email: waiting_email
	 	};
	 	let newvalues = {
	 		$set : {
	 			isActivated: true
	 		}
	 	};
	 	walletRepo.updateWallet(query, newvalues).then(function(data){
	 		res.send(data);
	 	});
	 } else {
	 	res.send('error')
	 }
	 });	 
});

module.exports = router;
