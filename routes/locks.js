// lock.js
var crypto = require('crypto');
var debug = require('debug')('smalo:api');
var devices = require('config').get('devices');
var express = require('express');
var slack = require('simple-slack-webhook');
var util = require('util');

var door = require('../lib/door');
var DoorStatus = require('../lib/door-status');
var doorStatus = new DoorStatus();
doorStatus.on('changeStatus', function(lockStatus){
  // 鍵の状態を確認する
  debug('[Door] change to ' + lockStatus);
});
var IBeacon = require('../lib/ibeacon');
var iBeacon  = new IBeacon();

slack.init({
  path: process.env['SLACK_WEBHOOK_URL'],
  username: 'SMALO',
  channel: '#activity'
});

var router = express.Router();
router.param('hash', function(req, res, next, id){
  // uuid|major|minorでのチェックを行う。
  if (id.length !== 64) {
    var error = new Error('400 Bad Request');
    error.status = 400;
    next(error);
  } else {
    var result = devices.some(function(device){
      if (device.deviceName && device.uuid) {
        var source = device.uuid + '|' + iBeacon.getMajor() + '|' + iBeacon.getMinor();
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

  // Slackへの通知
  debug(req.device, 'slack:post', 'unlock');
  slack.text(util.format('玄関のドアを解錠しました（ :key: %s）',  req.device.deviceName));

  // 鍵の解錠
  door.unlock();

  // major/minor及びbeaconの更新
  iBeacon.emit('refresh', 'unlock');

  res.send('200 OK');
});


router.get('/locks/locking/:hash', function(req, res, next){
  console.log('requested: locking');

  // Slackへの通知
  debug(req.device, 'slack:post', 'lock');
  slack.text(util.format('玄関のドアを施錠しました（ :key: %s）',  req.device.deviceName));

  // 鍵の施錠
  door.lock();

  // major/minor及びbeaconの更新
  iBeacon.emit('refresh', 'lock');

  res.send('200 OK');
});


router.get('/locks/status/:hash', function(req, res, next){
  console.log('requested: status');
  res.send(doorStatus.getStatus());
});

module.exports = router;
