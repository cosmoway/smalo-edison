// dor-status.js
var debug = require('debug')('door:status');
var events = require('events');
var mraa = require('mraa');
var util = require('util');

var switch01 = new mraa.Gpio(21); // J18-8
var switch02 = new mraa.Gpio(48); // J20-7
var checkInterval = 1000 * 2;

switch01.dir(mraa.DIR_IN);
switch02.dir(mraa.DIR_IN);

switch01.mode(mraa.MODE_PULLUP);
switch02.mode(mraa.MODE_PULLUP);


function DoorStatus() {
  events.EventEmitter.call(this);

  this._status = null;
  var self = this;

  debug('DoorStatus init.');

  setInterval(function(){
    switch01_value = switch01.read();
    switch02_value = switch02.read();

    debug({switch01: switch01_value, switch02: switch02_value, status:self._status});

    if (switch01_value === 1 && switch02_value === 0) {
      if (self.isUnlocked() === false) {
        debug('changed the status of the door to unlock.');

        self._status = 'unlocked';
        self.emit('changeStatus', 'unlocked');
      }
    } else if (switch01_value === 0 && switch02_value === 1) {
      if (self.isLocked() === false) {
        debug('changed the status of the door to lock.');

        self._status = 'locked';
        self.emit('changeStatus', 'locked');
      }
    } else {
      if (self.isLocked() === true || self.isUnlocked() === true) {
        debug('changed the status of the door to unknown.');

        self._status = null;
        self.emit('changeStatus', 'unknown');
      }
    }
  }, checkInterval);
}

util.inherits(DoorStatus, events.EventEmitter);

DoorStatus.prototype.isLocked = function(){
  return this._status === 'locked';

}

DoorStatus.prototype.isUnlocked = function(){
  return this._status === 'unlocked';
}

module.exports = DoorStatus;
