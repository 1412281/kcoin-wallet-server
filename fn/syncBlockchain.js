const WebSocket = require('ws');
var block = require('./block');
var q = require('q')
var userRepo = require('../models/userRepo')
var walletRepo = require('../models/walletRepo')
var transactionRepo = require('../models/transactionRepo')

var All_Blocks = [];

const PING_SOCKET_SECOND = 30;
const CHECK_LENGTH_BLOCK_SECOND = 300;

exports.initAllBlocks = function () {
    var d = q.defer()
    block.getBlocksSize().then(function (length) {
        for(var i = 0; i < length; i += 100) {
            block.getBlocks(i).then(function (blocks) {
                addBlock(All_Blocks, blocks);
                if (All_Blocks.length >= length) d.resolve('done')

            })
        }
    });
    return d.promise;
};

// exports.GetAllBlocks = function () {
//     // return All_Blocks;
//     return require('./blockchain.json')
// }
// Get ALL Block 
exports.GetAllBlocks = function () {
    return All_Blocks;
}

var CalculateUpdateUsersBalance = function () {
    // Calculate from 4 source:
    //1. from External: others address send into address in database
    // get all address from database
    walletRepo.getAllUsersBalance(0, {}).then(function (alldata) {
        var all_user = alldata.users_balance;
        console.log('----------GET ALL USER INFO----------', all_user.length)
        transactionRepo.getAllUsersTransaction(0, {}).then(function (data) {
            var all_internal_transaction = data.users_transaction
            console.log('----------GET ALL INTERNAL TRANSACTION INFO----------', all_internal_transaction.length)
            all_user.forEach(function (user) {
                // get user balance from MEMORY/EXTERNAL
                console.log('---------------1. get receive from external', user.email)
                userRepo.getBalance(user.address).then(function (balance_received_outside) {
                    console.log(user.address, ":", balance_received_outside)
                    console.log('---------------2. get from internal')
                    var Total_Balance = parseInt(balance_received_outside)// so du kha dung
                    var Total_Real_Balance = parseInt(balance_received_outside) // so du thuc te
                    all_internal_transaction.forEach(function (internal_transaction) {
                        if (internal_transaction.address_receive == user.address) {
                            if (internal_transaction.status == 'done') {
                                Total_Real_Balance += parseInt(internal_transaction.coin)
                                Total_Balance += parseInt(internal_transaction.coin)
                            }
                        }
                        if (internal_transaction.email_send == user.email) {
                            Total_Balance -= parseInt(internal_transaction.coin)
                            if (internal_transaction.status != 'pending') {
                                Total_Real_Balance -= parseInt(internal_transaction.coin)
                            }
                        }
                    })
                    console.log('---------------3. total:', Total_Balance, ' ======', Total_Real_Balance)
                    // // update 2 above balance in database
                    // userRepo.updateBabance(user.email, Total_Balance, Total_Real_Balance).then(function (result) {
                    //     console.log('---------------4. updated', user.email, result)
                    // })
                });
            })
        })
    })
}
exports.ReloadUSersBalance = function () {
    return CalculateUpdateUsersBalance()
}


    exports.runBlockchainListener = function () {
    const ws = new WebSocket('wss://api.kcoin.club');
// const ws = new WebSocket('http://localhost:4000/');

    ws.on('open', function open() {
        console.log('connected');
    });

    ws.onmessage = function (socket) {
        // console.log(socket);
        const data = JSON.parse(socket.data);
        console.log(data);
        if ( data.type === 'block') {
            const block = data.data;
            addBlock(All_Blocks,[block]);
            transactionRepo.checkBlockHasTransactionInSystem(block);
            transactionRepo.checkBlockHasAddressReceiveInSystem(block);
        }
        if (data.type === 'transaction') {
            //khong quan tam
        }
    };
    setInterval(function () {
        console.log('ping server', Date.now());

        // transaction.addTransaction({data: 'data'});
        ws.send('something');
    }, PING_SOCKET_SECOND * 1000);

    setInterval(function () {
        console.log('check blocksize', Date.now());

        const loss = block.getBlocksSize() > All_Blocks.length;
        if (loss > 0) {
            block.getLossBlock(loss).then(function (lossBlocks) {
                block.addBlock(All_Blocks,lossBlocks);
            });
            CalculateUpdateUsersBalance()
        }
    }, CHECK_LENGTH_BLOCK_SECOND * 1000);
};

var addBlock = function (AllBlocks, blocks) {
    // console.log('add block', blocks); //add to db
    // db.insert(data);
    blocks.forEach(function (block) {
        AllBlocks.push(block);
    })
};
