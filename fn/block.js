var axios = require('axios');
var q = require('q');
var db = require('./db_firebase');
var file = require('file-system');


// var Blocks = require('./blockchain.json');
var Blocks = [];

axios.defaults.baseURL = 'https://api.kcoin.club/';

exports.getLengthBlocksFromDB = function () {
    var d = q.defer();
    db.find('block', 'current').then(function (current) {
        d.resolve(current.length);
    })
    return d.promise;
}

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

exports.getCurrentBlocks = function (length) {

    var listCurrent = [];
    for(var i = 0; i < length; i += 100) {
        listCurrent.push(
            axios.get('/blocks', {
                params: {
                    limit: length - i >= 100 ? 100 : length - i,
                    offset: i,
                    order: 0
                }
            })
        );
    }
    var d = q.defer();
    q.all(listCurrent).then(function (list) {
        var listRes = [];
        list.forEach(function (result) {
            listRes.push(result.data);
        });
        // console.log(listRes.length);
        d.resolve(listRes);

    });
    return d.promise;
}

exports.getLossBlock = function (loss) {
    console.log(loss);
    var listLoss = [];
    for(var i = 0; i < loss; i+=100) {
        listLoss.push(
            axios.get('/blocks', {
            params: {
                limit: loss - i >= 100 ? 100: loss - i,
                offset: i,
                order: -1
            }
            })
        );
    }
    var d = q.defer();
    q.all(listLoss).then(function (list) {
        var listRes = [];
        list.forEach(function (result) {
            listRes.push(result.data);
        });
        // console.log(listRes.length);
        d.resolve(listRes);

    });
    return d.promise;
}

