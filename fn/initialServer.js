const transfer = require('./transfer');
const db = require('./db_firebase');
const listener = require('./listener');
var syncBlockchain = require('./syncBlockchain');
var transactionRepo = require('../models/transactionRepo');

console.log('==================START WALLET KCOIN BLOCKCHAIN==========================');
syncBlockchain.initAllBlocks().then(function (res) {
    console.log('-------Get and save Blockchain----------');
    var All_blocks = syncBlockchain.GetAllBlocks();
    console.log(All_blocks.length);

    //find transaction has confirm when server down

    //

    deleteAllOutputCurrent().then(function (res) {

        console.log('--------GET REFERENCE OUTPUT CAN USE OF SYSTEM--------');
        transfer.getAllOutputCanUseInBlockchain().then(function (outputs) {
            // console.log(outputs);
            outputs.forEach(function (output) {
                db.load('output', {transaction_hash: output.transaction_hash}).then(function (res) {
                    if (res.length === 0) {
                        console.log('inset out');
                        db.insert('output', output.transaction_hash + output.index, output);
                    }
                })
            });
            listener.initListener();
            console.log('--------GET EXTERNAL TRANSACTION SEND TO SYSTEM---------');
            // update all balance of user in system
            syncBlockchain.ReloadUSersBalance().then(function (result) {
                // console.log(result)
            })



        });
    });

});
syncBlockchain.runBlockchainListener();

var deleteAllOutputCurrent = function () {
    return db.load('output', {}).then(function (outputs) {
        outputs.forEach(function (output) {
            db.delete('output', output.transaction_hash + output.index.toString());
        })
    })
}

