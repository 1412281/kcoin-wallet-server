const WebSocket = require('ws');
var block = require('./block');

// var transaction = require('./transaction');
// var db = require('./db_mongodb');

// Global variable contains 
var All_Blocks = [];

exports.initAllBlocks = function () {
    block.syncBlockchain(All_Blocks);
};


// Get ALL Block 
exports.GetAllBlocks = function () {
    return All_Blocks;
}

exports.runListener = function () {
    const ws = new WebSocket('wss://api.kcoin.club');
// const ws = new WebSocket('http://localhost:4000/');

    ws.on('open', function open() {
        console.log('connected');
    });

    ws.onmessage = function (socket) {
        console.log(socket);
        const data = JSON.parse(socket.data);
        if ( data.type === 'block') {
            addBlock(data.data);
        }
    };
    setInterval(function () {
        console.log('ping server', Date.now());

        // transaction.addTransaction({data: 'data'});
        ws.send('something');
    }, 30000);

    setInterval(function () {
        console.log('check blocksize', Date.now());

        const loss = block.getBlocksSize() > All_Blocks.length;
        if (loss > 0) {
            block.getLossBlock(loss).then(function (lossBlocks) {
                addBlock(lossBlocks);
            });
        }
    }, 300000);
};

const addBlock = function (blocks) {
    console.log('add block', blocks); //add to db
    // db.insert(data);
    All_Blocks.push(blocks);
};

