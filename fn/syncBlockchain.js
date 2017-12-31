// const WebSocket = require('ws');
var block = require('./block');
// var transaction = require('./transaction');
// var db = require('./db_mongodb');

// Global variable contains 
var All_Blocks = [];

exports.InitAllBlocks = function() {
    block.syncBlockchain(All_Blocks);
};

// Get ALL Block 
exports.GetBlocks = function(){
	return All_Blocks;
}

// const ws = new WebSocket('wss://api.kcoin.club');
// // const ws = new WebSocket('http://localhost:4000/');
//
// ws.on('open', function open() {
//     console.log('connected');
// });
//
// ws.onmessage = function (socket) {
//     console.log(socket.type);
//     fnBlock.addBlock(socket.data);
// };

// setInterval(function () {
//     console.log('ping server');
//     block.addBlock({data: 'data'});
//     transaction.addTransaction({data: 'data'});
//     // ws.send('something');
// }, 3000);