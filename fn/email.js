var express = require('express');
var router = express.Router();
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var os = require("os");
var q = require('q');
const HOST = 'localhost:4000';
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

exports.sendEmail = function (emailaddress, address, host){
    List_Waiting.push({
        waiting_email: emailaddress,
        verify_number: address
    });
    console.log('List_Waiting: ',List_Waiting);
    link = "http://"+HOST+"/email/verify?address="+address;
    mailOptions = {
        to : emailaddress,
        subject : "Please confirm your Email account",
        html : "Hello,<br>Your address is <strong>"+address+"<strong> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
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

//send email transaction confirm with content:
const content= {
    transactionID: 1,
    sender: "tdlam123@gmail.com",
    sender_address: 'aaa',
    receiver_address: 'bbb',
    recerver: 'ttlam'
}
const renderHTML_TransactionConfirm = function (content ) {
    var html = '' +
        'Hello,' +
        '<br>Your Transaction information below:' +
        'TransactionID:'+'<strong>"+content.transactionID+"<strong> ' +
        'Your wallet address:'+'<strong>"+content.sender_address+"<strong> ' +
        'Receive address:'+'<strong>"+content.receiver_address+"<strong> ' +
        '<strong>"+address+"<strong> ' +
        'Please Click on the link to verify your email.<br>' +
        '<a href="+link+">Click here to confirm this transaction</a>'
    return html;
}

exports.sendEmailTransactionConfirm = function (content){
    List_Waiting.push({
        waiting_email: emailaddress,
        verify_number: address
    });
    console.log('List_Waiting: ',List_Waiting);
    link = "http://"+HOST+"/email/verify?address="+address;
    mailOptions = {
        to : emailaddress,
        subject : "Confirm your Transaction",
        html : "Hello,<br>Your address is <strong>"+address+"<strong> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
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
