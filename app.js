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
app.use(bodyParser.urlencoded({extended: false}));
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
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
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
const listener = require('./fn/listener');


syncBlockchain.initAllBlocks().then(function (res) {
    var All_blocks = syncBlockchain.GetAllBlocks()
    console.log(All_blocks.length)
    console.log('--------GET BLOCKCHAIN DONE--------');
    console.log('--------GET REFERENCE OUTPUT CAN USE OF SYSTEM--------');
    transfer.getAllOutputCanUseInBlockchain().then(function (outputs) {
        console.log(outputs);
        outputs.forEach(function (output) {
            db.load('output', {transaction_hash: output.transaction_hash}).then(function (res) {
                if (res.length === 0) {
                    console.log('inset out');
                    db.insert('output', output.transaction_hash + output.index, output);
                }
            })
        })

        listener.createOutput().then(function (result) {
            console.log('========CREATE OUTPUT========');
            console.log(result);
        });
    })
    // console.log('--------GET EXTERNAL TRANSACTION SEND TO SYSTEM---------');
    // // update all balance of user in system
    // syncBlockchain.ReloadUSersBalance().then(function (result) {
    //     console.log(result)
    // })
    //
    // listener.createOutput().then(function (result) {
    //     console.log(result);
    // });

});
const a = {
    "version": 1,
    "inputs": [{
        "referencedOutputHash": "a5d8f1b1d81382d5232d0cda75f315cb75f718ac92e25959a04a7dfae722b330",
        "referencedOutputIndex": 0,
        "unlockScript": "PUB 2d2d2d2d2d424547494e205055424c4943204b45592d2d2d2d2d0a4d4947664d413047435371475349623344514542415155414134474e4144434269514b42675143306f6a454a545148487934377666314931424b5063773748340a64334b6c34445842767233505a624c63552b5a4c793941625a54594e6c79456d473749674373556d59314b4b67336635304478495863517232447a4a7753476b0a696f466e395a6a5361326e505a66627a69363545427650352f526570366f5653734c646f3133484e4e6a77383862454a7a717946326a4f33503136767144505a0a472f53443162476d474b364a3063464572774944415141420a2d2d2d2d2d454e44205055424c4943204b45592d2d2d2d2d0a SIG 9899667493e2818cf29af6b0c1168f2d7778764e712a194cc44a1c083cb228aa908b4af257bbee711b65e5a4430053b5ba4cc937730de5e0a7b1cbdeb187731a4a01fab66815dab47fce1f44dfae8351e892675eb31e124d6196c498f6d24f4e88089bc157c4a16bb34eade1f807e38b41324cd889843cc3bc97d165ee3683d3"
    }],
    "outputs": [{
        "value": 1000,
        "lockScript": "ADD f3b405bb8620f67d44c920681a6eaa72457d902b96d25a5e75a5f94fb175b4f7"
    }, {
        "value": 1000,
        "lockScript": "ADD 76bc4481051ec678fc711e4604c042b3e52a49138d58e04a66d2da960af96edd"
    }, {
        "value": 1000,
        "lockScript": "ADD cf3c7ec84c59b88f27643be33e59e209b52bf7a27d56d67e613fa9d0eada0a38"
    }, {
        "value": 1000,
        "lockScript": "ADD f84f062a339d070fcbcd266230f4ccc2a40fe94fd87f99902c7942d5aa4191a8"
    }, {
        "value": 1000,
        "lockScript": "ADD c6485820d33804cd9131dba65ff5f305b886c0f90c401685ef0971e407d87149"
    }, {
        "value": 1000,
        "lockScript": "ADD 0da63d37bf58b6799fc3c5a841f09821ea975fba8819a2222c6f5b726d45636a"
    }, {
        "value": 1000,
        "lockScript": "ADD ed492f31293e8f3f3794f0623af74cdc84ea4383886fd5794c1010c007f151e9"
    }, {
        "value": 1000,
        "lockScript": "ADD 0c298b919988d4198b35eb374e318d20cfb2ea6f4af841f0f05994a553805324"
    }, {
        "value": 1000,
        "lockScript": "ADD 2979c4c068d70c492881dd4b3563627c6d5a3695c5989f582e9ce8fca63f68ba"
    }, {"value": 1000, "lockScript": "ADD 613e9c367d6c56b6160cbf3b13b14f43b003713d8aba12fa01ebdb63d38f2b56"}]
};

module.exports = app;
