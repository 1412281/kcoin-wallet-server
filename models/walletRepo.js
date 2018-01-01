var q = require('q'),
    db = require('../fn/db_mongodb'),
    email = require('../fn/email');
const Collection = 'wallet';

exports.login = function(entity) {
    var d = q.defer();

    var sql = mustache.render(
        'select * from wallet where id = "{{id}}" and password = "{{password}}"', entity);

    db.load(sql).then(function(rows) {
        if (rows.length > 0)
            d.resolve(rows[0]);
        else {
            d.resolve({});
        }
    });

    return d.promise;
};

exports.register = function(entity, emailhost) {
    // insert into wallet(id, password, email, balance)
    var deferred = q.defer();
    db.insert(entity, Collection).then(function(data) {
        //send email to confirm email address
        email.sendEmail(entity.email, emailhost);
        deferred.resolve(data);
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
    db.load(query, Collection).then(function(data) {
        deferred.resolve(data);
    });

    return deferred.promise;
};

exports.updateWallet = function(myquery, data) {
    // update base on query and values
    var deferred = q.defer();
    db.update(myquery, data, Collection).then(function(data) {
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