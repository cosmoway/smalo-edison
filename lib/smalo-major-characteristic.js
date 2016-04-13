var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloMajorCharacteristic(smalo) {
  SmaloMajorCharacteristic.super_.call(this, {
    uuid: 'b2e238b4-5b26-48c1-9023-2099a02c99b0',
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Major Parameters' // 仮
      })
    ]
  });
  this.smalo = smalo;
  this._value = new Buffer('ひらけゴマ！！(major)');
}

util.inherits(SmaloMajorCharacteristic, BlenoCharacteristic);

SmaloMajorCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log([offset, callback]);
    console.log('[Read] Read Request offset: ' + offset);
    callback(this.RESULT_SUCCESS, this._value);
};

SmaloMajorCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log(' - onSubscribe - ');

    //this._updateValueCallback = updateValueCallback;
};

SmaloMajorCharacteristic.prototype.onUnsubscribe = function() {
    console.log(' - onUnsubscribe - ');

    //this._updateValueCallback = null;
};

module.exports = SmaloMajorCharacteristic;
