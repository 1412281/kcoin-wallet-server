var axios = require('axios');
var q = require('q');
var db = require('./db_mongodb');

axios.defaults.baseURL = 'https://api.kcoin.club/';

exports.addBlock = function(data) {
    console.log('add block', data); //add to db
    db.insert(data);
};

exports.syncBlockchain = function () {
    console.log('sync');
    // loopSyncAllBlock(0);
};

const loopSyncAllBlock = function(offset) {
    getBlocks(offset).then(function (response) {
        if (response.length > 0) {
            console.log(response);
            loopSyncAllBlock(offset + 100);
        }
    })
};

const getBlocks = function (offset) {
    var d = q.defer();

    axios.get('/blocks', {
        params: {
            limit: 100,
            offset: offset,
            order: -1
        }
    }).then(function (response) {
        d.resolve(response.data);
    }).catch(function (err) {
         console.log(err);
    });

    return d.promise;
};
