var q = require('q'),
    db = require('../fn/db_mongodb'),
    API_block = require('../fn/block'),
    sync = require('../fn/syncBlockchain');

var userRepo = require('./userRepo')


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
    var ListBlocks = sync.GetAllBlocks();
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

exports.getTotalCoinReceiveOutSystem = function (listuser) {
	var TOTAL = 0
	var singleton = true
	listuser.forEach(function (user) {
		// bo qua user la admin1 vi do la dia chi he thong
		if (user.email != 'admin1@gmail.com') {
            address = "ADD " + user.address;
            var ListBlocks = sync.GetAllBlocks();
            //Search in all Blocks in memory
            console.log(ListBlocks.length);
            ListBlocks.forEach(function (block) {
                block.transactions.forEach(function (transaction) {
                    for (i = 0; i < transaction.outputs.length; i++) {
                        if (transaction.outputs[i].lockScript === address) {
                            // xac nhan outputs nay gui tien cho dia chi trong he thong
                            console.log('da nhan:', transaction.outputs[i].value)
                            TOTAL += transaction.outputs[i].value
                        }
                    }
                });
            });
        }
        // neu la admin thi con so nay phai cong them so du thuc te cua admin CHI MON LAN DUY NHAT
        else {
			if (singleton == true) {
				console.log('CONGSODUADMIN')
                TOTAL += parseInt(user.real_balance)
				singleton = false
            }
		}
    })
	console.log(TOTAL)
	return TOTAL;
}
