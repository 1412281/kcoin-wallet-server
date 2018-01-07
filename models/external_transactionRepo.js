var q = require('q'),
    sync = require('../fn/syncBlockchain'),
    transfer = require('../fn/transfer'),
    userRepo = require('./userRepo'),
    db = require('../fn/db_firebase');

const COLLECTION = 'external_transaction';

exports.updateExternalTransaction = function(id, data) {
    // update base on query and values
    var deferred = q.defer();
    db.update(COLLECTION, email, data).then(function(data) {

        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.insertExternalTransaction = function (entity) {
    var deferred = q.defer();
    // console.log(entity);

    db.insert(COLLECTION, entity.email, entity).then(function(res) {
        //send email to confirm email address
        console.log(res);
        email.sendEmail(entity.email, entity.address);
        deferred.resolve(data.address);
    });
    return deferred.promise;
}
