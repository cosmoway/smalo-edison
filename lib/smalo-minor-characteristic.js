var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloMinorCharacteristic(smalo) {
  SmaloMinorCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-minor-characteristic'),
    properties: ['read', 'notify'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Minor Parameters'
      })
    ]
  });

  this.smalo = smalo;
  this._value = new Buffer(String(this.smalo.minor));
  this._updateValueCallback = null;
  var self = this;
  console.log('MinorParameters init.', this.smalo.major, '/', this.smalo.minor);

  this.smalo.on('refresh', function(major, minor){
    //console.log();
    self._value = new Buffer(String(major));
    if (self._updateValueCallback) {
      self._updateValueCallback(self._value);
    }
  });
}

util.inherits(SmaloMinorCharacteristic, BlenoCharacteristic);

SmaloMinorCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log([offset, callback]);
  console.log('[Read] Read Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloMinorCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('[onSubscribe] MinorParameters');

  this._updateValueCallback = updateValueCallback;
};

SmaloMinorCharacteristic.prototype.onUnsubscribe = function() {
  console.log('[onUnsubscribe] MinorParameters');

  this._updateValueCallback = null;
};

module.exports = SmaloMinorCharacteristic;
