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

exports.getToTalBalanceSystem = function() {
    var d = q.defer();
    var TOTAL_BALANCE = 0;
    db.load('output',{}).then(function(outputs) {
        console.log(outputs)
        outputs.forEach(function (output) {
            TOTAL_BALANCE +=output.value
        })
        d.resolve(TOTAL_BALANCE)

    });
    return d.promise;
};