var util = require('util');
var events = require('events');
var config = require('config');
var debug = require('debug')('smalo');

function Smalo() {
  events.EventEmitter.call(this);

  this.config = config;
  this.major = Math.floor(Math.random() * 65536);
  this.minor = Math.floor(Math.random() * 65536);
  this.lockStatus = 'unloked';
  this.refreshTime = 1000 * 20;
  var self = this;

  setInterval(function(){
    self.major = Math.floor(Math.random() * 65536);
    self.minor = Math.floor(Math.random() * 65536);
    debug({major: self.major, minor: self.minor});

    self.emit('refresh', self.major, self.minor);
  }, this.refreshTime);

  // 鍵の状態を通知する
  //self.emit('changeLock', this.lockStatus);
}

util.inherits(Smalo, events.EventEmitter);

module.exports = Smalo;

