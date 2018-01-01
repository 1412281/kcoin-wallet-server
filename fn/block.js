var axios = require('axios');
var q = require('q');
var db = require('./db_mongodb');
var file = require('file-system');


// var Blocks = require('./blockchain.json');
var Blocks = [];

axios.defaults.baseURL = 'https://api.kcoin.club/';

exports.syncBlockchain = function (All_Blocks) {
    console.log('sync');
    Blocks = All_Blocks;
    loopSyncAllBlock(0);
};

const loopSyncAllBlock = function(offset) {
    console.log(offset);
    getBlocks(offset).then(function (response) {
        if (response.length > 0) {
            response.forEach(function (block){

                Blocks.push(block);
            });
            // console.log(response);
            loopSyncAllBlock(offset + 100);
        }
        else {
            // console.log('write file');
            //
            // require('jsonfile').writeFile('./resource/blockchain.json', Blocks, {flag: 'a'}, function (err) {
            //     console.error(err)
            // })
        }
    });
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
