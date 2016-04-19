var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var locks = require('./routes/locks');

var app = express();

var server = app.listen(10080, function(){
  console.log("Node.js is listening to PORT:" + server.address().port);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', locks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
