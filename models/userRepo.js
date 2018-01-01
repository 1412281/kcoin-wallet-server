var q = require('q'),
    transactionRepo = require('./transactionRepo'),
    db = require('../fn/db_mongodb');



exports.register = function(entity) {

    var sql = mustache.render(
        'insert into user(email) ' +
        'values ("{{email}}")', entity);

    return db.insert(sql);
}

exports.getBalance = function (address) {
    var deferred = q.defer();
    var Balance = 0;
    var listOutput = transactionRepo.getAllTrans(address);
    // Calculate Balance base on output list
    listOutput.forEach(function(output) {
        if (!output.in_use)
            Balance+= output.value;
    });
    console.log(listOutput);
    deferred.resolve(Balance);
    return deferred.promise;
}

exports.updateBabance = function (data) {
    var d = q.defer();

    const query = {
        address: data.address
    }
    const update = {
        balance: data.balance
    }

    db.update(query, update, user).then(function (result) {
        d.resolve(result);
    });

    return d.promise;
}