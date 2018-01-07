var q = require('q'),
    db = require('../fn/db_mongodb'),
    API_block = require('../fn/block'),
    sync = require('../fn/syncBlockchain');


exports.getAllBlocks = function () {
    return sync.GetAllBlocks();
}


exports.getBlock = function (blockHash) {
	const blocks = sync.GetAllBlocks();
	const result = blocks.filter(function (block) {
		return blockHash === block.hash;
    });
	if (result.length > 0) {
		return result[0];
	}
	return {};
}

exports.getBalance = function (address) {
	var deferred = q.defer();
    address = "ADD "+ address;
    var Balance = 0;
    var listOutput = [];
    var ListBlocks = sync.GetBlocks();
    //Search in all Blocks in memory
    console.log(ListBlocks.length);
	ListBlocks.forEach(function(block){
		block.transactions.forEach(function(transaction) {
	    	for (i=0; i< transaction.outputs.length; i++) {
	    		if (transaction.outputs[i].lockScript === address){
	    			// save index output and hash of transaction
	    			listOutput.push({
	    				transaction_hash: transaction.hash,
	    				index: i,
	    				value: transaction.outputs[i].value,
	    				in_use: false
	    			});
	    		}
	    	}

	    });
    });
    // check in all inputs, 
    listOutput.forEach(function(output) {
    	ListBlocks.forEach(function(block) {
            block.transactions.forEach(function(transaction) {
            	transaction.inputs.forEach( function (input) {
            		if (input.referencedOutputHash == output.transaction_hash && input.referencedOutputIndex == output.index) {
            			output.in_use = true;
            		}
            	});
        	});
        });
	});
	// Calculate Balance base on output list
	listOutput.forEach(function(output) {
    	if (!output.in_use) 
    		Balance+= output.value;
	});
	console.log(listOutput);
	deferred.resolve(Balance);
    return deferred.promise;	
}