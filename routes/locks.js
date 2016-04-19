// lock.js
var crypto = require('crypto');
var devices = require('config').get('devices');
var express = require('express');
var router = express.Router();

var major = Math.floor(Math.random() * 65536);
var minor = Math.floor(Math.random() * 65536);

console.log({major: major, minor: minor});

router.param('hash', function(req, res, next, id){
  // uuid|major|minorでのチェックを行う。
  if (id.length !== 64) {
    var error = new Error('400 Bad Request');
    error.status = 400;
    next(error);
  } else {
    var result = devices.some(function(device){
      if (device.deviceName && device.uuid) {
        var source = device.uuid + '|' + major + '|' + minor;
        var hash = crypto.createHash('sha256').update(source).digest('hex');
        if (hash.toUpperCase() === id.toUpperCase()) {
          req.device = device;
          return true;
        }
      }
    });

    if (result) {
      next();
    } else {
      var error = new Error('403 Forbidden');
      console.dir(error);
      error.status = 403;
      next(error);
    }
  }
});

router.get('/locks/unlocking/:hash', function(req, res, next){
  console.log('requested: unlocking');
  res.send('200 OK');
});


router.get('/locks/locking/:hash', function(req, res, next){
  console.log('requested: locking');
  res.send('200 OK');
});


router.get('/locks/status/:hash', function(req, res, next){
  console.log('requested: status');
  res.send('locked');
});

module.exports = router;
