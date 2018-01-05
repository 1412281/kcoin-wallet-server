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
    var d = q.defer();

    var dbc = db.collection(collection);

    const cursor = {};
    var index;

    dbc = dbc.orderBy('date', 'asc');

    if (query.hasOwnProperty('cursor')) {
        
        const queryCursor = query.cursor;
        console.log(queryCursor);
        if (queryCursor.hasOwnProperty('where')) {
            cursor.where = queryCursor.where;
            const aAttributes = Object.keys(queryCursor.where);
            aAttributes.forEach(function (att) {
                dbc = dbc.where(att, '==', queryCursor[att]);
                // console.log(att, '== ', queryCursor[att]);
            });
        }

        if (queryCursor.hasOwnProperty('startAfter')) {
            const startAf = queryCursor.startAfter;
            dbc = dbc.startAfter(startAf);
            // console.log(startAf);
        }
        if (queryCursor.hasOwnProperty('limit')) {
            cursor.limit = queryCursor.limit;
            const limit = queryCursor.limit;
            dbc = dbc.limit(limit);
        }
    }
    else {
        if (query.hasOwnProperty('where')) {
            cursor.where = query.where;
            const aAttributes = Object.keys(query.where);
            aAttributes.forEach(function (att) {
                dbc = dbc.where(att, '==', query[att]);
                // console.log(att, '== ', query[att]);
            });
        }

        if (query.hasOwnProperty('startAt')) {
            const startAt = query.startAt;
            dbc = dbc.startAt(startAt);
        }
        if (query.hasOwnProperty('startAfter')) {
            const startAf = query.startAfter;
            dbc = dbc.startAfter(startAf);
            console.log(startAf);
        }
        if (query.hasOwnProperty('limit')) {
            cursor.limit = query.limit;
            const limit = query.limit;
            dbc = dbc.limit(limit);
        }
    }


    // console.log(att, query.orderBy[att]);
    dbc.get()
        .then(function(snapshot)
        {
            var results = [];
            snapshot.forEach(function (doc) {
                results.push(doc.data());
            })
            // console.log(Object.keys(index)[0]);
            cursor.startAfter = snapshot.docs[snapshot.docs.length - 1].data().date;

            d.resolve({data: results, cursor: cursor});
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
