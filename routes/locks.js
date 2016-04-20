// lock.js
var crypto = require('crypto');
var debug = require('debug')('smalo:api');
var devices = require('config').get('devices');
var express = require('express');
var slack = require('simple-slack-webhook');
var util = require('util');

var DoorStatus = require('../lib/door-status');
var doorStatus = new DoorStatus();
doorStatus.on('changeStatus', function(lockStatus){
  // 鍵の状態を確認する
  debug('[Door] change to ' + lockStatus);
});

var major = Math.floor(Math.random() * 65536);
var minor = Math.floor(Math.random() * 65536);
console.log({major: major, minor: minor});

slack.init({
  path: process.env['SLACK_WEBHOOK_URL'],
  channel: '@shinkai'
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
        var source = device.uuid + '|' + major + '|' + minor;
        var hash = crypto.createHash('sha256').update(source).digest('hex');
        if (hash.toUpperCase() === id.toUpperCase()) {
          req.device = device;
          return true;
        }
      }
    });

    if (result) {
      // 鍵を開ける。
      // major/minorを更新
      // iBeaconの再発信
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
  // Slackへの通知
  debug(req.device, 'slack:post', 'unlock');
  slack.text(util.format('玄関のドアを解錠しました（ :key: %s）',  req.device.deviceName));

  console.log('requested: unlocking');
  res.send('200 OK');
});


router.get('/locks/locking/:hash', function(req, res, next){
  // Slackへの通知
  debug(req.device, 'slack:post', 'lock');
  slack.text(util.format('玄関のドアを施錠しました（ :key: %s）',  req.device.deviceName));

  console.log('requested: locking');
  res.send('200 OK');
});


router.get('/locks/status/:hash', function(req, res, next){
  console.log('requested: status');
  res.send(doorStatus.getStatus());
});

module.exports = router;
