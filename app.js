var express = require('express'),
	fs = require('fs'),
	log4js = require('log4js'),
	morgan = require('morgan'),
	path = require('path'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	SessionStore = require('express-mysql-session'),
	env = process.env.NODE_ENV || 'development',  
    mysqlcfg = require("./lib/conf/mysql.json"),
	cfg = mysqlcfg[env]||mysqlcfg,
	pool = require('mysql-queries').init(cfg)._pool,
	routes = require('./lib/routes/index'),
	code= require("./lib/conf/code"),
	auth = require('./lib/routes/auth'),
	user = require('./lib/routes/user'),
	prod = require('./lib/routes/prod'),
	txn = require('./lib/routes/txn'),
	cust = require('./lib/routes/cust'),
	type = require('./lib/routes/type');

var app = express(),
  logDirectory = __dirname + '/log',
  sessionStore = null;
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
log4js.configure("./lib/conf/.log4js");
var logger = log4js.getLogger('logInfo');
// setup the logger
app.use(morgan('combined', {stream: {write:function(str){
  logger.info(str);
}}}));
var checkAuth = function(req, res, next) {
  if(!req.session.user) {
	res.send({code:code.auth_failure});
    return;
  }

  //  the user is logged in, so call next()
  next();
};
pool.getConnection(function(err, conn) {
    if (!!err) {
      console.error('[sqlqueryErr] '+err.stack);
      return;
    }
	sessionStore = new SessionStore({}, conn);
    //_pool.releaseConnection(client);   
//console.log(app.get('env'));
app.use(session({
    secret: 'myshop123',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth);
app.use('/users', checkAuth, user);
app.use('/prods', checkAuth, prod);
app.use('/txns', checkAuth, txn);
app.use('/custs', checkAuth, cust);
app.use('/types', checkAuth, type);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

});

module.exports = app;
