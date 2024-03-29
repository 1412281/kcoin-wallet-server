var q = require('q'),
    db = require('../fn/db_firebase'),
    utils = require('../fn/utils'),
    email = require('../fn/email'),
    transactionRepo = require('./transactionRepo')
var userRepo = require('../models/userRepo');
var crypt = require('../fn/crypt');

const COLLECTION = 'user';


exports.login = function(entity) {
    var d = q.defer();
     db.find(COLLECTION, entity.email ).then(function(data) {
         console.log(data);
         d.resolve(data);

    });
    return d.promise;
};

exports.register = function(entity) {
    console.log('--------REGISTER-------')
    console.log(entity)
    var user = {
        email: entity.email,
        password: entity.password,
        address: entity.address,
        balance: "100",
        isActivated: false,
        real_balance: "100"
    }
    // insert into wallet(id, password, email, balance)
    var deferred = q.defer();
    // console.log(entity);

    db.insert(COLLECTION, entity.email, user).then(function(res) {
        var key = {
            address: entity.address,
            publicKey: entity.publicKey,
            privateKey: crypt.encrypt(entity.privateKey)
        }
        db.insert('key', entity.address, key).then(function (res) {
            //send email to confirm email address

        })
        console.log(res);
        email.sendEmail(entity.email, entity.address);
        deferred.resolve(entity.address);

    });
    return deferred.promise;
};


exports.getDashboard = function(email) {
    return q.all([getBalance((email))]);
};

exports.checkExist = function(email) {
    var deferred = q.defer();
    var query = {
        email: email
    }
    db.find(COLLECTION, email).then(function(data) {

        if (data.email) {
            console.log(true);
            deferred.resolve(true);
        }
        else {
            console.log(false);
            deferred.resolve(false);
        }
    });

    return deferred.promise;
};

exports.checkWalletExist = function (address) {
    var deferred = q.defer();

    db.load(COLLECTION, {address: address}).then(function(data) {
        console.log(data);
        if (data.length > 0) {
            console.log(true);
            deferred.resolve(true);
        }
        else {
            console.log(false);
            deferred.resolve(false);
        }
    });

    return deferred.promise;
}

exports.updateWallet = function(email, data) {
    // update base on query and values
    var deferred = q.defer();
    db.update(COLLECTION, email, data).then(function(data) {

        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.updateBalanceByAddress = function(email, data) {
    // update base on query and values
    var deferred = q.defer();
    db.update(COLLECTION, email, data).then(function(data) {

        deferred.resolve(data);
    });
    return deferred.promise;
};

var getBalance = function(email) {
    var d = q.defer();

    db.find(COLLECTION, email).then(function(response) {
        return d.resolve({balance: response.balance});
    });

    return d.promise;
};

exports.getAllUsersBalance = function (limit, cursor) {
    var d = q.defer();
    console.log(limit)
    console.log(cursor)
    const query = {
        orderBy: {email: 'desc'}, limit: parseInt(limit), cursor: cursor
    };
    db.loadFull(COLLECTION, query).then(function(response) {
        var result = {
            users_balance: [],
            cursor: response.cursor,
            next: response.next
        };
        response.data.forEach(function (element) {
            result.users_balance.push({
                email: element.email,
                address: element.address,
                balance: element.balance,
                real_balance: element.real_balance
            });
        });
        d.resolve(result);
    });
    return d.promise;
}


exports.DeletePendingTransaction = function (transaction) {
    console.log('---------START DELETE PENDING---------------')
    var hashTransaction = transactionRepo.renderTransactionToHashString(transaction)
    console.log(hashTransaction)
    var d = q.defer();
    // check if it is a pending transaction
    transactionRepo.getPendingTrans().then(function (listpending) {
        listpending.forEach(function (element) {
            var hashDB = transactionRepo.renderTransactionToHashString(element)
            if (hashDB === hashTransaction) {
                transactionRepo.updateTransactionStatus(hashTransaction, 'cancel').then(function (result) {
                    // add for balance of user sender
                    userRepo.getInfoByEmail(element.email_send).then(function (sender) {
                        console.log(sender)
                        if(sender) {
                            userRepo.updateBabance(element.email_send, parseInt(sender.balance)+ parseInt(element.coin)).then(function (result) {
                                d.resolve(result);
                            })
                        }
                    })
                })
            }
        })
    })
    return d.promise;
}