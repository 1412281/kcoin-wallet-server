var q = require('q'),
    transactionRepo = require('./transactionRepo'),
    db = require('../fn/db_firebase');

const COLLECTION = "user";



exports.register = function(entity) {

    var sql = mustache.render(
        'insert into user(email) ' +
        'values ("{{email}}")', entity);

    return db.insert(sql);
}

exports.checkExistInDB = function (address) {
    var d = q.defer();

    db.load(COLLECTION, {address: address}).then(function (result) {
        console.log('check exist', result[0]);
        if (result.length === 0) {
           d.resolve(false);
        }
        else {
            d.resolve(true);
        }
    })

    return d.promise;
}

exports.getInfoByAddress = function (address) {
    var d = q.defer();

    db.load(COLLECTION, {address: address}).then(function (result) {
        // console.log(result);
            d.resolve(result[0]);
    });

    return d.promise;
}

exports.getInfoByEmail = function (email) {
    var d = q.defer();

    db.load(COLLECTION, {email: email}).then(function (response) {
        d.resolve(response[0]);
    })

    return d.promise;
}

exports.getBalance = function (address) {
    var deferred = q.defer();

    transactionRepo.getAllTrans(address).then(function (listOutput) {
        var Balance = 0;
        listOutput.forEach(function(output) {
            if (!output.in_use)
                Balance+= output.value;
        });
        console.log(listOutput);
        deferred.resolve(Balance);
    });
    // Calculate Balance base on output list

    return deferred.promise;
}


exports.getBalanceUser = function (email) {
    var d = q.defer();

    db.find(COLLECTION, email).then(function (response) {
        d.resolve(response.balance);
    })

    return d.promise;
}

exports.updateBabance = function (email, balance) {
    var d = q.defer();

    db.update(COLLECTION, email, {balance: balance.toString()}).then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}