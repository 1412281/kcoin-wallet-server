const WebSocket = require('ws');
var block = require('./block');
var transaction = require('./transaction');

block.syncBlockchain();

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