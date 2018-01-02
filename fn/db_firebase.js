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
            var results = [];
            snapshot.forEach(function (doc) {
                results.push(doc.data());
            })
            d.resolve(results);
            // d.resolve(snapshot)
        })
        .catch(function(err) {
            console.log('Error getting documents', err);
        });
    return d.promise;
}

exports.loadFull = function(collection, query, orderBy, offset, limit) {
    var d = q.defer();

    var dbc = db.collection(collection);
    const aAttributes = Object.keys(query);

    aAttributes.forEach(function (att) {
        dbc = dbc.where(att, '==', query[att]);
        // console.log(att, '== ', query[att]);
    });
    if (orderBy !== '') {
        dbc = dbc.orderBy(orderBy, 'desc');
    }

    if (offset !== 0) {
        dbc = dbc.startAt(offset);
    }

    if (limit !== 0) {
        dbc = dbc.limit(limit);
    }

    dbc.get()
        .then(function(snapshot)
        {
            var results = [];
            snapshot.forEach(function (doc) {
                results.push(doc.data());
            })
            d.resolve(results);
            // d.resolve(snapshot)
        })
        .catch(function(err) {
            console.log('Error getting documents', err);
        });
    return d.promise;
}
exports.insert = function(collection, doc, data) {
    var d = q.defer();

    var dbc;
    if (doc !== '') {
        dbc = db.collection(collection).doc(doc);
    }
    else {
        dbc = db.collection(collection).doc();
    }
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


// const db = require('./fn/db_firebase');
// db.load('users', {adress: '123'}).then(function (res) {
//     console.log(res);
// });
// db.insert('users', '123', {address: '112123s'}).then(function (res) {
//     console.log(res);
// })
// db.update('users', '123' , {name: 'nemmm'}).then(function (res) {
//     console.log(res);
// });
// db.find('users', '123' ).then(function (res) {
//     console.log(res);
// })
// db.delete('users', '123').then(function (res) {
//     console.log(res);
// })

