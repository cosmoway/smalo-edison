var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloLockStatusCharacteristic(smalo) {
  SmaloLockStatusCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-lock-status-characteristic'),
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Lock Status'
      })
    ]
  });

  this.smalo = smalo;
  this._value = new Buffer(this.smalo.lockStatus);
  this._updateValueCallback = null;
  var self = this;
  console.log('LockStatus init. ', this.smalo.lockStatus);

  this.smalo.on('changeLock', function(lockStatus){
    // console.log();
    // lockStatus = locked or unlocked
    self._value = new Buffer(lockStatus);
    if (self._updateValueCallback) {
      self._updateValueCallback(self._value);
    }
  });
}

util.inherits(SmaloLockStatusCharacteristic, BlenoCharacteristic);

SmaloLockStatusCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log([offset, callback]);
  console.log('[Read] Read Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloLockStatusCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[onSubscribe] LockStatus');

  this._updateValueCallback = updateValueCallback;
};

SmaloLockStatusCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[onUnsubscribe] LockStatus');

  this._updateValueCallback = null;
};

module.exports = SmaloLockStatusCharacteristic;
