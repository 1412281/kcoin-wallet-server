var axios = require('axios');
var q = require('q');
var db = require('./db_mongodb');
var file = require('file-system');


// var Blocks = require('./blockchain.json');
var Blocks = [];

axios.defaults.baseURL = 'https://api.kcoin.club/';


exports.getBlocks = function (offset) {
    console.log(offset);
    var d = q.defer();

    axios.get('/blocks', {
        params: {
            limit: 100,
            offset: offset,
            order: 0
        }
    }).then(function (response) {
        d.resolve(response.data);
    }).catch(function (err) {
         console.log(err);
    });

    return d.promise;
};

exports.getBlocksSize = function () {
    var d = q.defer();

    axios.get('/blocks').then(function (response) {
        // console.log(response.headers['x-total-count']);
        d.resolve(response.headers['x-total-count']);
    }).catch(function (err) {
         console.log(err);
    });

    return d.promise;
};

exports.getLossBlock = function (loss) {
    var d = q.defer();

    axios.get('/blocks', {
        params: {
            limit: 100,
            offset: offset,
            order: -1
        }
    }).then(function (response) {
        d.resolve(response.data.slice(0, loss));
    }).catch(function (err) {
        console.log(err);
    });

    return d.promise;
}

