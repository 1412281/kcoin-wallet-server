var q = require('q'),
    db = require('../fn/db_firebase');
const COLLECTION = 'admin';


exports.login = function(entity) {
    var d = q.defer();
    db.find(COLLECTION, entity.email).then(function(data) {
        if (data.length > 0 && data.password == entity.password)
            d.resolve(data);
        else
            d.resolve([]);
    });
    return d.promise;
};