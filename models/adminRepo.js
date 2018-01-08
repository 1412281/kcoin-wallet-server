var q = require('q'),
    db = require('../fn/db_firebase');
const COLLECTION = 'admin';


exports.login = function(entity) {
    var d = q.defer();
    db.find(COLLECTION, entity.email).then(function(data) {
        console.log('-----ADMIN-----')
        console.log(entity)
        console.log(data)
        if (data && data.password == entity.password)
            d.resolve(data);
        else
            d.resolve([]);
    });
    return d.promise;
};