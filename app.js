var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var adhoc = require('./routes/adhoc');
var algs = require('./routes/algs');
var flow = require('./routes/flow');
var processes = require('./routes/processes');
var queue = require('./routes/queue');

var Datastore = require('nedb')

processData = new Datastore();
processMetadata = new Datastore({filename: './procMetadata.db', autoload:true});
queue_check_logs = new Datastore({filename: './procCheckLogs.db', autoload:true});

var app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'swagger-ui')));


app.use(function(req, res, next) {

  //to allow cross domain requests to send cookie information.
  //res.header('Access-Control-Allow-Credentials', true);

  // origin can not be '*' when crendentials are enabled. so need to set it to the request origin
  res.header('Access-Control-Allow-Origin',  '*');

  // list of methods that are supported by the server
  res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');

  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

  next();
});

//app.use('/hub/adhoc', adhoc);
//app.use('/hub/algorithms', algs);
//app.use('/hub/flow', flow);
//app.use('/hub/processes', processes);
//app.use('/hub/queue', queue);

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
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
