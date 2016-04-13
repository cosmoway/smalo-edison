var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloLockStatusCharacteristic(smalo) {
  SmaloLockStatusCharacteristic.super_.call(this, {
    uuid: '0ab375be-141a-4ba2-81ee-e6ecc695ac06',
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Lock Status'
      })
    ]
  });
  this.smalo = smalo;
  this._value = new Buffer('今開いてる？');
}

util.inherits(SmaloLockStatusCharacteristic, BlenoCharacteristic);

SmaloLockStatusCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log([offset, callback]);
  console.log('[Read] Read Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloLockStatusCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log(' - onSubscribe - ');

  //this._updateValueCallback = updateValueCallback;
};

SmaloLockStatusCharacteristic.prototype.onUnsubscribe = function() {
  console.log(' - onUnsubscribe - ');

  //this._updateValueCallback = null;
};

module.exports = SmaloLockStatusCharacteristic;
