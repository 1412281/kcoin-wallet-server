var axios = require('axios');
var q = require('q');

axios.defaults.baseURL = 'https://api.kcoin.club/';

exports.addBlock = function(data) {
    console.log('add block', data);
};

exports.syncBlockchain = function () {
    console.log('sync');
    loopSyncAllBlock(0);
};

const loopSyncAllBlock = function(offset) {
    getBlocks(offset).then(function (response) {
        console.log(response);
        if (response.length > 0) {
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
    });

    return d.promise;
};
