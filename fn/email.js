var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var transactionRepo = require('../models/transactionRepo');
var walletRepo = require('../models/walletRepo');
var userRepo = require('../models/userRepo');
var q = require('q');
var ultis = require('./utils');
// const HOST = 'https://kcoin-wallet-server.herokuapp.com';
const HOST = 'http://localhost:4000';
const USER = 'kcoinwallet2lam@gmail.com';
const PASSWORD = '123123123123';
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
var mailOptions, link;
var List_Email_Register_Waiting = [];

exports.sendEmail = function (emailaddress, address, host){
    List_Email_Register_Waiting.push({
        waiting_email: emailaddress,
        verify_number: address
    });
    console.log('List_Waiting: ',List_Email_Register_Waiting);
    link = HOST+"/email/verify?address="+address;
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
//     coin: '4',
//     status: 'pending',
//     email_send: 'lamtran2601@gmail.com',
//     address_receive: '520159ee31cad850eeb6b26c91ab96fd2a9a4333366e38dbcbfa930224e9183a',
//     date: '2018-01-06T17:37:58.805Z' }
//send email transaction confirm with content:
const renderHTML_TransactionConfirm = function (content, link ) {
    var html = '' +
        'Hello,' +
        '<br>Your Transaction information below:</br>' +
        '<br>Receive address:'+'<strong>'+content.address_receive+'</strong></br>' +
        '<br>KCoin:'+'<strong>'+content.coin+'</strong></br>' +
        '<br>Date:'+'<strong>'+Date.parse(content.date).toString()+'</strong></br>' +
        '<br>Please Click on the link to confirm transaction.</br>' +
        '<br><a href="'+link+'">'+link+'</a></br>'
    return html;
}

exports.sendEmailTransactionConfirm = function (transaction){
    // hash transaction content
    var hash = transactionRepo.renderTransactionToHashString(transaction)
    console.log('sent:'+hash)
    link = HOST+"/email/transactionconfirm?hash="+hash;
    mailOptions = {
        to : transaction.email_send,
        subject : "Confirm your Transaction",
        html : renderHTML_TransactionConfirm(transaction, link)
    }
    transport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        } else {
            console.log("transaction email sent: " + response);
            return response;
        }
    });
}

exports.verify = function(verify_num){
    var d = q.defer();
    List_Email_Register_Waiting.forEach(function(element){
        if (element.verify_number === verify_num) {
            //remove element after verify
            List_Email_Register_Waiting.splice(List_Email_Register_Waiting.indexOf(element), 1);
            //return email if it has verify_number
            d.resolve(element.waiting_email);
        }
        else {
            d.resolve('');
        }
    });
    return d.promise;
}

exports.transactionConfirm = function (hash) {
    var d = q.defer();
    transactionRepo.getPendingTrans().then( function (listpending) {
        console.log(listpending)
        if (listpending.length === 0) {
            d.resolve('confirm fail')
        }
        // hash each transaction element and compare with hash input
        // if equal, update this transaction element
        listpending.map(function (element) {
            console.log('pending')
            var hashfromDB = transactionRepo.renderTransactionToHashString(element)
            console.log('getHashFromDB:'+hashfromDB)
            console.log(hashfromDB === hash)
            if (hashfromDB === hash){
                // update status of element
                var newStatus = 'done';
                if (element.system === 'out') {
                    newStatus = 'waiting';
                }
                transactionRepo.updateTransactionStatus(hash, newStatus).then(function (res) {
                    //add balance to receiver
                    //find user email by receive wallet
                    var d1 = q.defer();
                    userRepo.getInfoByAddress(element.address_receive).then( function(email_receive){
                        if (element.system === 'in') {
                            console.log('--------RECEIVER: ', email_receive)
                            if (email_receive) {
                                    userRepo.update2Balance(email_receive.email, parseInt(email_receive.balance) + parseInt(element.coin),parseInt(email_receive.real_balance) + parseInt(element.coin)).then(function (res) {
                                        console.log(res);
                                        d1.resolve(res);
                                    })
                                // }
                                // else {
                                //     userRepo.updateBabance(email_receive.email, parseInt(email_receive.balance) + parseInt(element.coin)).then(function (res) {
                                //         console.log(res);
                                //         d1.resolve(res);
                                //     })
                                // }
                            }
                            else { //address email not exists in database, address outside system

                            }
                        }
                        else { // system out

                        }
                    });
                    d.resolve(d1.promise);
                })
            }
        })
    })

    return d.promise;
}

