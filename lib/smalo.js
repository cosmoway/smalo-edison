var util = require('util');
var events = require('events');
var crypto = require('crypto');
var config = require('config');
var slack = require('simple-slack-webhook');
var debug = require('debug')('smalo');

slack.init({
  path: process.env['SLACK_WEBHOOK_URL'],
  channel: '@shinkai'
});

function Smalo() {
  events.EventEmitter.call(this);

  this.config = config;
  this.major = Math.floor(Math.random() * 65536);
  this.minor = Math.floor(Math.random() * 65536);
  this.lockStatus = 'unloked';
  this.refreshInterval = 1000 * 300;
  var self = this;

  debug({major: this.major, minor: this.minor});

  setInterval(function(){
    self.major = Math.floor(Math.random() * 65536);
    self.minor = Math.floor(Math.random() * 65536);
    debug({major: self.major, minor: self.minor}, 'refresh');

    self.emit('refresh', self.major, self.minor);
  }, this.refreshInterval);

  // 鍵の状態を通知する
  //self.emit('changeLock', this.lockStatus);

  self.on('validDevice', function(device, motion){
    // DB保存
    debug('DB:save');
  });

  self.on('validDevice', function(device, motion){
    // Slackへの通知
    debug(device, 'slack:post', motion);
    slack.text('... テストー' + motion);
  });

}

util.inherits(Smalo, events.EventEmitter);

Smalo.prototype.auth = function(data, motion) {
  return this.config.get('devices').some(function(device){
    if (device.deviceName && device.uuid) {
      var hash = crypto.createHash('sha256');
      var generatedData = hash.update(device.uuid + '|' + this.major + '|' + this.minor).digest('hex');

      if (generatedData.toUpperCase() === data.toUpperCase()) {
        // 認証デバイスを伝える。
        this.emit('validDevice', device, motion);
        return true;
      }
    }
  }, this);
};

module.exports = Smalo;

