const WebSocket = require('ws');
var block = require('./block');

// var transaction = require('./transaction');
// var db = require('./db_mongodb');

// Global variable contains 
var All_Blocks = [];

exports.initAllBlocks = function() {
    block.syncBlockchain(All_Blocks);
};

// Get ALL Block 
exports.getAllBlocks = function(){
	return require('../resource/blockchain.json');
	//return All_Blocks;
};

// Get ALL Block 
exports.GetBlocks = function(){
    return All_Blocks;
}

exports.runListener = function () {
    const ws = new WebSocket('wss://api.kcoin.club');
// const ws = new WebSocket('http://localhost:4000/');

    ws.on('open', function open() {
        console.log('connected');
    });

    ws.onmessage = function (socket) {
        console.log(socket.type);
        addBlock(socket.data);
    };
    setInterval(function () {
    console.log('ping server', Date.now());


    // transaction.addTransaction({data: 'data'});
    ws.send('something');
}, 30000);
};

const addBlock = function(data) {
    console.log('add block', data); //add to db
    // db.insert(data);
    All_Blocks.push(data);
};

