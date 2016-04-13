var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloMinorCharacteristic(smalo) {
  SmaloMinorCharacteristic.super_.call(this, {
    uuid: '68da96b6-7634-440a-8fcf-95ef1a5e7e5b',
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Minor Parameters'
      })
    ]
  });
  this.smalo = smalo;
  this._value = new Buffer('ひらけゴマ！！(minor)');
}

util.inherits(SmaloMinorCharacteristic, BlenoCharacteristic);

SmaloMinorCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log([offset, callback]);
  console.log('[Read] Read Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloMinorCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log(' - onSubscribe - ');

  //this._updateValueCallback = updateValueCallback;
};

SmaloMinorCharacteristic.prototype.onUnsubscribe = function() {
  console.log(' - onUnsubscribe - ');

  //this._updateValueCallback = null;
};

module.exports = SmaloMinorCharacteristic;
