var q = require('q'),
    db = require('../fn/db_firebase'),
    utils = require('../fn/utils'),
    email = require('../fn/email');

const COLLECTION = 'user';


exports.login = function(entity) {
    var d = q.defer();
     db.load(entity, Collection).then(function(data) {
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


exports.getDashboard = function(id) {
    return q.all([getBalance((id))]);
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

exports.updateWallet = function(email, data) {
    // update base on query and values
    var deferred = q.defer();
    db.update(COLLECTION, email, data).then(function(data) {

        deferred.resolve(data);
    });
    return deferred.promise;
};

var getBalance = function(id) {
    var d = q.defer();

    const entity = {
        id: id
    };
    var sql = mustache.render('select balance from wallet where id = "{{id}}"',entity);

    db.load(sql).then(function(rows) {
        return d.resolve(rows[0]);
    });

    return d.promise;
};