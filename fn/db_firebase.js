const admin = require('firebase-admin');
const q = require('q');

var serviceAccount = require("../resource/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();


exports.load = function(query, collection) {
    var d = q.defer();

    var dbc = db.collection(collection);
    const aAttributes = Object.keys(query);

    aAttributes.forEach(function (att) {
        dbc = dbc.where(att, '==', query[att]);
        // console.log(att, '== ', query[att]);
    });

    dbc.get()
        .then(function(snapshot)
        {
            var results = [];
            snapshot.forEach(function (doc) {
                results.push(doc.data());
            })
            d.resolve(results);
        })
        .catch(function(err) {
            console.log('Error getting documents', err);
        });
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


var docRef = db.collection('wa').doc('alovelace');




var setAda = docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
});

