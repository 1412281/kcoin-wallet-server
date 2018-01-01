var q = require('q'),
    db = require('../fn/db_mongodb'),
    API_block = require('../fn/block'),

    sync = require('../fn/syncBlockchain');


exports.fetchAllBlockchain = function () {
    return sync.getAllBlocks();
}


exports.getBlock = function (query) {
	var deferred = q.defer();

    db.load(query).then(function(data) {
        deferred.resolve(data);
    });
    return deferred.promise;
}
