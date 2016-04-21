// dor-status.js
var debug = require('debug')('door:status');
var events = require('events');
// var mraa = require('mraa');
var exec = require('child_process').exec;
var util = require('util');

// var switch01 = new mraa.Gpio(21); // J18-8
var pin_switch01 = 4; // P1-16
// var switch02 = new mraa.Gpio(48); // J20-7
var pin_switch02 = 5; // P1-18
var checkInterval = 1000 * 2;

// switch01.dir(mraa.DIR_IN);
exec('gpio mode %PIN% in'.replace(/%PIN%/, pin_switch01));
// switch02.dir(mraa.DIR_IN);
exec('gpio mode %PIN% in'.replace(/%PIN%/, pin_switch02));

// switch01.mode(mraa.MODE_PULLUP);
exec('gpio mode %PIN% up'.replace(/%PIN%/, pin_switch01));
// switch02.mode(mraa.MODE_PULLUP);
exec('gpio mode %PIN% up'.replace(/%PIN%/, pin_switch02));


function DoorStatus() {
  events.EventEmitter.call(this);

  this._status = 'unknown';
  var self = this;

  debug('DoorStatus init.');

  setInterval(function(){
    // switch01_value = switch01.read();
    // switch02_value = switch02.read();
    exec('gpio read %PIN%'.replace(/%PIN%/, pin_switch01),
      function (error1, stdout1, stderr1) {
        switch01_value = stdout1.replace(/\n/, '');
        exec('gpio read %PIN%'.replace(/%PIN%/, pin_switch02),
          function (error2, stdout2, stderr2) {
            switch02_value = stdout2.replace(/\n/, '');
            debug({switch01: switch01_value, switch02: switch02_value, status:self._status});

            if (switch01_value === '1' && switch02_value === '0') {
              if (self.isUnlocked() === false) {
                debug('changed the status of the door to unlock.');

                self._status = 'unlocked';
                self.emit('changeStatus', 'unlocked');
              }
            } else if (switch01_value === '0' && switch02_value === '1') {
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
          }
        );
      }
    );

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
