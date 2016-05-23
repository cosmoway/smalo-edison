// door-status-titlt-switch.js
var debug = require('debug')('door:status');
var events = require('events');
var mraa = require('mraa');
var util = require('util');

var tilt_switch = new mraa.Gpio(21); // J18-8
var checkInterval = 1000 * 2;

tilt_switch.dir(mraa.DIR_IN);
tilt_switch.mode(mraa.MODE_PULLUP);

function DoorStatus() {
  events.EventEmitter.call(this);

  this._status = 'unknown';
  var self = this;

  debug('DoorStatus init.');

  setInterval(function(){
    var tilt_switch_value = tilt_switch.read();

    debug({tilt_switch: tilt_switch_value, status: self._status});

    if (tilt_switch_value === 1) {
      if (self.isUnlocked() === false) {
        debug('changed the status of the door to unlock.');

        self._status = 'unlocked';
        self.emit('changeStatus', 'unlocked');
      }
    } else if (tilt_switch_value === 0) {
      if (self.isLocked() === false) {
        debug('changed the status of the door to lock.');

        self._status = 'locked';
        self.emit('changeStatus', 'locked');
      }
    } else {
      if (self.isLocked() === true || self.isUnlocked() === true) {
        debug('changed the status of the door to unknown.');

        self._status = 'unknown';
        self.emit('changeStatus', 'unknown');
      }
    }
  }, checkInterval);
}

util.inherits(DoorStatus, events.EventEmitter);

DoorStatus.prototype.getStatus = function(){
  return this._status;
}

DoorStatus.prototype.isLocked = function(){
  return this._status === 'locked';
}

DoorStatus.prototype.isUnlocked = function(){
  return this._status === 'unlocked';
}

module.exports = DoorStatus;
