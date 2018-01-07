var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');


var index = require('./routes/index');
var user = require('./routes/user');
var block = require('./routes/block');
var wallet = require('./routes/wallet');
var email = require('./routes/email');
var admin = require('./routes/admin');

var transaction = require('./routes/transaction');
var syncBlockchain = require('./fn/syncBlockchain');
// var transfer = require('./fn/transfer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/user', user);
app.use('/block', block);
app.use('/transaction', transaction);
app.use('/wallet', wallet);
app.use('/email', email);
app.use('/admin', admin);

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


// syncBlockchain.runListener();
// syncBlockchain.initAllBlocks();
// const transactionRepo = require('./models/transactionRepo');
const transfer = require('./fn/transfer');
const db = require('./fn/db_firebase');
//
syncBlockchain.initAllBlocks().then(function (res) {

    console.log('--------GET BLOCKCHAIN DONE--------');
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
        })
    })
    console.log('--------GET EXTERNAL TRANSACTION SEND TO SYSTEM---------');

});

module.exports = app;
