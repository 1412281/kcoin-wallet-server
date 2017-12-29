var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io-client');
const WebSocket = require('ws');

var index = require('./routes/index');
var users = require('./routes/users');
var block = require('./routes/block');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/block', block);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// var socket = io('wss://api.kcoin.club', {reconnection: true, autoConnect: true});
// // var socket = io('http://localhost:4000/', {reconnect: true});
// // var socket = io('http://localhost:4000/', {reconnection: true, autoConnect: true});
//
// // socket.on('connect_error', function(socket1) {
// //     console.log(socket.id); // 'G5p5...'
// // });
//
// socket.on('reconnect', function(socket) {
//     console.log(socket); // 'G5p5...'
// });
//
// socket.on('connect', function(socket1) {
//     console.log(socket.id); // 'G5p5...'
// });
//
// socket.on('connect', function () { console.log("socket connected"); });
// socket.emit('private message', { user: 'me', msg: 'whazzzup?' });
//
// socket.on('connect', function (socket) {
//     console.log('Connected!');
//     console.log(socket);
//
// });
// socket.on('block', function (socket) {
//     console.log('new block!');
//     console.log(socket);
// });
//
// socket.on('transaction', function (socket) {
//     console.log('new transaction!');
//     console.log(socket);
// });




const ws = new WebSocket('wss://api.kcoin.club');
// const ws = new WebSocket('http://localhost:4000/');

ws.on('open', function open() {
    console.log('connected');
});

ws.onmessage = function (data) {
    console.log(data);
};

setInterval(function () {
    console.log('ping server');
    ws.send('something');
}, 30000);









module.exports = app;
