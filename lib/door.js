// door.js
var debug = require('debug')('smalo:door');
var events = require('events');
var util = require('util');
var Gpio = require('pigpio').Gpio;
var motor = new Gpio(7, {
  mode: Gpio.OUTPUT
});
var tilt = new Gpio(4, {
  mode: Gpio.INPUT,
  pullUpDown: Gpio.PUD_UP,
  edge: Gpio.EITHER_EDGE
});
var duty_lock = 1100;
var duty_unlock = 2000;

// Doorモジュール
function Door() {
  events.EventEmitter.call(this);

  this._status = 'unknown';
  var tilt_switch_value = 1;
  var self = this;

  // スイッチの変化を検出する。
  tilt.on('interrupt', function(level) {
    debug('tilt switch level: ' + level);
    tilt_switch_value = level;
  });

  debug('Door init.');

  setInterval(function(){
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
  }, 2000);
}

util.inherits(Door, events.EventEmitter);

Door.prototype.getStatus = function(){
  return this._status;
}

Door.prototype.isLocked = function(){
  return this._status === 'locked';
}

Door.prototype.isUnlocked = function(){
  return this._status === 'unlocked';
}

Door.prototype.lock = function(){
  // 施錠処理
  debug('changing the door to lock.');
  motor.servoWrite(duty_lock);

  // GPIOを解放する。
  setTimeout(function(){
    debug('GPIO release(lock).');
    motor.servoWrite(0);
  }, 1500);
}

Door.prototype.unlock = function(){
  // 解錠処理
  debug('changing the door to unlock.');
  motor.servoWrite(duty_unlock);

  // GPIO を解放する。
  setTimeout(function(){
    debug('GPIO release(unlock).');
    motor.servoWrite(0);
  }, 1500);
}

module.exports = Door;


// デバッグ用
// usage: node door.js [unlock|lock]
{
  var command = process.argv[2];
  var door = new Door();
  if (command == 'unlock') {
    door.unlock();
    console.log('Unlock.');
    setTimeout(function(){
      process.exit();
    }, 2500);
  } else if (command == 'lock') {
    door.lock();
    console.log('Lock.');
    setTimeout(function(){
      process.exit();
    }, 2500);
  }
}

