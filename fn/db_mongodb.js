var mongo = require('mongodb').MongoClient,
    q = require('q'),
    assert = require('assert');
const DATABASE = 'wallet-db';
var url = 'mongodb://kcoin:kT3XUg8L28MLFTMH@cluster0-shard-00-00-i2mpg.mongodb.net:27017,cluster0-shard-00-01-i2mpg.mongodb.net:27017,cluster0-shard-00-02-i2mpg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';

exports.load = function(query, collection) {
    var d = q.defer();
    mongo.connect(url, function (err, db) {
        var cursor = db.db(DATABASE).collection(collection).find(query);
        cursor.toArray(function (mongoError, result) {
            assert.equal(null, mongoError);
            d.resolve(result);
        });
    })

    return d.promise;
}

exports.insert = function(data, collection) {
    var d = q.defer();
    mongo.connect(url, function (err, db) {
        console.log(db);
        db.db(DATABASE).collection(collection).insertOne(data, function (err, result) {
            console.log('inserted');
            assert.equal(null, err);
            d.resolve(result);
            db.close();
        })
    })
    return d.promise;
}

exports.update = function(query, data, collection) {
    var d = q.defer();
    mongo.connect(url, function (err, db) {
        console.log(db);
        db.db(DATABASE).collection(collection).updateOne(query, data, {}, function (result) {
            console.log('updated');
            assert.equal(null, err);
            d.resolve(result);
            db.close();
        });

    });

    return d.promise;
}

exports.delete = function(query, collection) {

    var d = q.defer();

    mongo.connect(url, function (err, db) {
        console.log(db);
        db.db('wallet-db').collection(collection).deleteOne(query, {}, function (result) {
            console.log('deleted');
            assert.equal(null, err);
            d.resolve(result);
            db.close();
        });

    });

    return d.promise;
}