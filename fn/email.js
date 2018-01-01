var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var os = require("os");
var q = require('q');
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
var rand, mailOptions, link;
var List_Waiting = [];

exports.sendEmail = function (emailaddress, host){
    rand = Math.floor((Math.random() * 100000) + 54);
    List_Waiting.push({
        waiting_email: emailaddress,
        verify_number: rand.toString()
    });
    console.log(List_Waiting);
    link = "http://"+host+"/email/verify?id="+rand;
    mailOptions = {
        to : emailaddress,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    transport.sendMail(mailOptions, function(error, response){
     	if(error){
            console.log(error);
     	} else {
        console.log("Message sent: " + response.message);
        return response;
	    }
	});
}

exports.verify = function(verify_num){
    var d = q.defer();
    List_Waiting.forEach(function(element){
        if (element.verify_number === verify_num) {
            //remove element after verify
            List_Waiting.splice(List_Waiting.indexOf(element), 1);
            //return email if it has verify_number
            d.resolve(element.waiting_email);
        }
        else {
            d.resolve('');
        }
    });
    return d.promise;
}

exports.getRandom = function (){
    return rand;
}
