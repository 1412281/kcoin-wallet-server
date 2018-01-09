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

var initalServer = require('./fn/initialServer');

// var crypt = require('./fn/crypt');
// const en = crypt.encrypt('2d2d2d2d2d424547494e205253412050524956415445204b45592d2d2d2d2d0a4d4949435841494241414b426751444a3633615943684461654b704d475344346352737461716f7a7443735847625039635a484a362b766c45574c416438526e0a7659747a69436b44677861516f4544706a4a4d6935482f794e496f3644723351674f447741754a57327a48525469656e4559356f3158487347596c725a6e334b0a565078466d566f3669754e4f584a3964687169417578587546576167612f675a7668456f422b3243645a4e7033356f366b432b7a7942674e56514944415141420a416f474145644c5947426d6a585457546972345a472f55582b673156557455506a4b31334a754d5568476476336a754870516574625a376370576b61666258660a6b7771695544745a625a59502b54684d4430336e305854653567696276454b6e6772534643354c67744e7256312f2f454545786a4c36767a6b357a6e4d434b7a0a6b774c6f733941417265495067676e7a6f47396f6b6364754271396c325a33534e6e63574f426c614f4b78624c6f4543515144756b684879444e432b2b6267520a524c3162655631584f376946624555356932373241727747533435755050314547724478524a746b494d586e4d47716f6b4755634874727775755755466652320a4132514c4f367368416b4541324b7672386a6e325030564c63702b65716432473275657874576f4670333053524e38726d41684c316667364655356e4c2b39530a584d502f2f37614264626464487a52764a2b78666d4c5478643259505239307674514a42414d556c42686c6378372b5a5171646167355173315a7035716f44760a4f4d4656334f7345315858715342674735452b384d7334646f4c39386161346a6a3341656172397a4b2f2f556f6c546555376157464c31486f4b4543514538630a6a747a31727553784c336764736667427937423338706e7a715462625975564575773061306c33413861772f3455744f546274545556435432626361695754510a5a316d6a5939424647506c6f6957484b38425543514575684f6367796670614c30594a346a6d4b455047623546624330436a637a386d516345486b63745159500a6a367137757775656c306f446a73307031636c396432375a77717133707878417635623856394f357065303d0a2d2d2d2d2d454e44205253412050524956415445204b45592d2d2d2d2d0a');
// console.log(en);
// console.log(crypt.decrypt(en));

module.exports = app;
