// lock.js
var express = require('express');
var router = express.Router();


router.param('hash', function(req, res, next, id){
  // uuid|major|minorでのチェックを行う。
  req.device =  {deviceName: 'shinkai', uuid: 'xxxx'};
  next();
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
  res.send('200 OK');
});

module.exports = router;
