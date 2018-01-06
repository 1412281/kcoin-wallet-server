var q = require('q'),
    db = require('../fn/db_firebase'),
    utils = require('../fn/utils'),
    email = require('../fn/email');

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
    // insert into wallet(id, password, email, balance)
    var deferred = q.defer();
    // console.log(entity);

    db.insert(COLLECTION, entity.email, entity).then(function(res) {
        //send email to confirm email address
        console.log(res);
        email.sendEmail(entity.email, entity.address);
        deferred.resolve(data.address);
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

var getBalance = function(email) {
    var d = q.defer();

    db.find(COLLECTION, email).then(function(response) {
        return d.resolve({balance: response.balance});
    });

    return d.promise;
};

exports.getUsersBalance = function (limit, offset) {
    var d = q.defer();
    console.log(limit)
    console.log(offset)

    db.loadFull(COLLECTION, {}, '', parseInt(offset), parseInt(limit)).then(function(data) {
        var result = [];
        data.forEach(function (element) {
            result.push({
                email: element.email,
                balance: element.balance,
                real_balance: element.balance
            });
        });
        console.log(result);
        d.resolve(result);
    });
    return d.promise;
}