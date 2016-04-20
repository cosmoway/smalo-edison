var config = require('config');
var crypto = require('crypto');
var debug = require('debug')('smalo');
var events = require('events');
var slack = require('simple-slack-webhook');
var util = require('util');

var door = require('./door');
var DoorStatus = require('./door-status');
var doorStatus = new DoorStatus();

slack.init({
  path: process.env['SLACK_WEBHOOK_URL'],
  channel: '@shinkai'
});

function refreshMajorAndMinor(smalo) {
  clearTimeout(smalo.timerId);

  smalo.major = Math.floor(Math.random() * 65536);
  smalo.minor = Math.floor(Math.random() * 65536);
  smalo.emit('refresh', smalo.major, smalo.minor);

  debug({major: smalo.major, minor: smalo.minor, status: 'refresh'});

  smalo.timerId = setTimeout(function(){
    refreshMajorAndMinor(smalo);
  }, smalo.refreshInterval);
}

function Smalo() {
  events.EventEmitter.call(this);

  this.config = config;
  this.doorStatus = doorStatus;
  this.major = Math.floor(Math.random() * 65536);
  this.minor = Math.floor(Math.random() * 65536);
  this.lockStatus = 'unloked';
  this.timerId = undefined;
  this.refreshInterval = 1000 * 300;
  var self = this;

  debug({major: this.major, minor: this.minor});

  this.timerId = setTimeout(function(){
    refreshMajorAndMinor(self);
  }, this.refreshInterval);

  this.doorStatus.on('changeStatus', function(lockStatus){
    // 鍵の状態を確認する
    debug('[Door] change to ' + lockStatus);
  });

  this.on('validDevice', function(device, motion){
    // 鍵を操作
    debug('door: ' + motion);
    if (motion === 'lock') {
      door.lock();
    } else {
      door.unlock();
    }
  });

  this.on('validDevice', function(device, motion){
    // DB保存
    debug('DB:save');
  });

  this.on('validDevice', function(device, motion){
    // Slackへの通知
    debug(device, 'slack:post', motion);
    slack.text(util.format('玄関のドアを%sしました（ :key: %s）',  motion === 'lock' ? '施錠' : '解錠', device.deviceName));
  });

  this.on('validDevice', function(device, motion){
    // major/minor を更新する。
    refreshMajorAndMinor(this);
  });
}

util.inherits(Smalo, events.EventEmitter);

Smalo.prototype.auth = function(data, motion) {
  return this.config.get('devices').some(function(device){
    if (device.deviceName && device.uuid) {
      var source = device.uuid + '|' + this.major + '|' + this.minor;
      var hash = crypto.createHash('sha256').update(source).digest('hex');

      if (hash.toUpperCase() === data.toUpperCase()) {
        // 認証デバイスを伝える。
        this.emit('validDevice', device, motion);
        return true;
      }
    }
  }, this);
};

//Smalo.prototype.refreshMajorAndMinor = function(smalo){
//  clearTimeout(smalo.timerId);
//
//  smalo.major = Math.floor(Math.random() * 65536);
//  smalo.minor = Math.floor(Math.random() * 65536);
//  smalo.emit('refresh', smalo.major, smalo.minor);
//
//  debug({major: smalo.major, minor: smalo.minor, status: 'refresh'});
//
//  smalo.timerId = setTimeout(function(){
//    smalo.refreshMajorAndMinor(smalo);
//  }, smalo.refreshInterval);
//};

module.exports = Smalo;
