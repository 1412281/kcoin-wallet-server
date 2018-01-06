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

exports.loadFull = function(collection, query) {

    console.log('qeeee', query);

    var d = q.defer();

    var dbc = db.collection(collection);

    var cursor = {};

    if(query.hasOwnProperty('orderBy')) {
        const aAttributes = Object.keys(query.orderBy);
        dbc = dbc.orderBy(aAttributes[0], query.orderBy[aAttributes[0]]);
    }

    if (query.hasOwnProperty('where')) {
        const aAttributes = Object.keys(query.where);
        aAttributes.forEach(function (att) {
            dbc = dbc.where(att, '==', query.where[att]);
            console.log(att, '==', query.where[att]);
        });
    }

    if (query.hasOwnProperty('limit')) {
        const limit = query.limit;
        dbc = dbc.limit(limit);
    }

    var tempQuery = query;
    if (query.hasOwnProperty('cursor') && JSON.stringify(query.cursor) !== JSON.stringify({})) {
        tempQuery = query.cursor;
        if (tempQuery.hasOwnProperty('startAt')) {
            const startAt = tempQuery.startAt;
            dbc = dbc.startAt(startAt);
        }
        else
        if (tempQuery.hasOwnProperty('startAfter')) {
            const startAf = tempQuery.startAfter;
            dbc = dbc.startAfter(startAf);
            // console.log(startAf);
        }
    }

    // console.log(att, query.orderBy[att]);
    dbc.get()
        .then(function(snapshot)
        {
            var results = [];
            snapshot.forEach(function (doc) {
                results.push(doc.data());
            });
            var next = Object.assign({}, cursor);
            cursor.startAt = snapshot.docs[0].data().date;
            next.startAfter = snapshot.docs[snapshot.docs.length - 1].data().date;

            d.resolve({data: results, cursor: cursor, next: next});
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
// db.loadFull('transaction', { limit: 1}).then(function (response) {
//     console.log(response.data);
//     // console.log(response.cursor);
//     db.loadFull('transaction', {cursor: response.cursor}).then(function (res) {
//         // console.log(res);
//         console.log(res.data);
//     })
// });
