var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloMajorCharacteristic(smalo) {
  SmaloMajorCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-major-characteristic'),
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Major Parameters'
      })
    ]
  });

  this.smalo = smalo;
  this._value = new Buffer(String(this.smalo.major));
  this._updateValueCallback = null;
  var self = this;
  console.log('MajorParameters init.', this.smalo.major, '/', this.smalo.minor);

  this.smalo.on('refresh', function(major, minor){
    //console.log();
    self._value = new Buffer(String(major));
    if (self._updateValueCallback) {
        self._updateValueCallback(self._value);
    }
  });
}

util.inherits(SmaloMajorCharacteristic, BlenoCharacteristic);

SmaloMajorCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log([offset, callback]);
  console.log('[Read] Read Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloMajorCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[onSubscribe] MajorParameters');

  this._updateValueCallback = updateValueCallback;
};

SmaloMajorCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[onUnsubscribe] MajorParameters');

  this._updateValueCallback = null;
};

module.exports = SmaloMajorCharacteristic;
