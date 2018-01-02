const admin = require('firebase-admin');
const q = require('q');

var serviceAccount = require("../resource/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

exports.find = function (collection, doc) {
    var d = q.defer();

    var dbc = db.collection(collection).doc(doc).get().then(function (doc) {
        if (doc.exists) {
            d.resolve(doc.data());
        }
        else {
            d.resolve([]);
        }
    });
    return d.promise;
};

exports.load = function(collection, query) {
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
            // var results = [];
            // snapshot.forEach(function (doc) {
            //     results.push(doc.data());
            // })
            // d.resolve(results);
            d.resolve(snapshot)
        })
        .catch(function(err) {
            console.log('Error getting documents', err);
        });
    return d.promise;
}

exports.insert = function(collection, doc, data) {
    var d = q.defer();
    var dbc = db.collection(collection).doc(doc);
    dbc.set(data).then(function (result) {
        // console.log(result);
        d.resolve(result);
    }).catch(function (err) {
        console.log(err);
    });

    return d.promise;
}

exports.update = function(collection, doc, data) {
    d = q.defer();

    var dbc = db.collection(collection);
    var db_doc = dbc.doc(doc);
    db_doc.get().then(function (res) {
            if (res.exists) {
                d.resolve(db_doc.update(data));
            }
            else {
                d.resolve("doc is not exists");

            }
        });
    return d.promise;
}

exports.delete = function(collection, doc) {

    d = q.defer();

    var dbc = db.collection(collection).doc(doc);
    d.resolve(dbc.delete());

    return d.promise;
}


var docRef = db.collection('wa').doc('alovelace');




var setAda = docRef.set({
    first: 'Ada',
    last: 'Lovelace',
    born: 1815
});

