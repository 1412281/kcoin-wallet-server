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

const transactionRepo = require('./models/transactionRepo');
const transfer = require('./fn/transfer');
const db = require('./fn/db_firebase');

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

    //
    // transactionRepo.createTransactionSystemOut({coin: '1', address_receive: 'e9c3529ba5c4622ef86daae57ad41c0973006465286fc07f8174b3fb68c70f2b'}).then(function (res) {
    //       console.log(res);
    // });
});



// transfer.getAllOutputCanUse().then(function (res) {
//     console.log(res);
// });
// syncBlockchain.runListener();
// transfer.createTransfer();
// syncBlockchain.initAllBlocks();
// const userRepo = require('./models/userRepo');
// const outputs = [ { address: '4edbd2d5a816a52f76a22e554ee0407e969f7c7374e6b3876d1a7aa06609b161',
//     value: 1,
//     in_use: false,
//     index: 1,
//     transaction_hash: '182bf58c1b3e77134968e947b28eebcec9d2c9dc892cf3bbda756bcd9dac5ee2' },
//     { index: 1,
//         transaction_hash: '503c52b6021ea00d80bd458b3d05058b9fbf3b33ea39fee79dab96b7868d677b',
//         address: '4edbd2d5a816a52f76a22e554ee0407e969f7c7374e6b3876d1a7aa06609b161',
//         value: 4,
//         in_use: false } ];
// const q = require('q');
//

// db.delete('output', '50f475c76bb34c1004c71480f7ae3a1ee99fe06a96bc90c21674f6886491d6420').then(function (res) {
//     console.log(res);
// })

// db.insert('transaction', '', {asdf: 'asdf'});
// db.loadFull('transactions', {where:{email_send:'lamtran2601@gmail.com'}, orderBy: {'date': 'asc'}, limit: 2}).then(function (response) {
//     console.log(response.data[0].date);
//     db.loadFull('transactions', {where:{email_send:'lamtran2601@gmail.com'}, orderBy: {'date': 'asc'},limit: 2, cursor: response.next}).then(function (res1) {
//         console.log(res1.data[0].date);
//         //get previous
//         db.loadFull('transactions', {where:{email_send:'lamtran2601@gmail.com'}, orderBy: {'date': 'asc'},limit: 2, cursor: response.cursor}).then(function (res2) {
//             console.log(res2.data[0].date);
//
//         })
//     })
//
// });
//
// db.loadFull('user', {orderBy: {email: 'desc'}, limit: 5, cursor: {}}).then(function (response) {
//     console.log(response);
//
//
// });

module.exports = app;
