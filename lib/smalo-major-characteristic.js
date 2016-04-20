var util = require('util');
var bleno = require('bleno');
var debug = require('debug')('smalo:characteristic:major');

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

  debug('MajorParameters init. ' +  this.smalo.major + '/' + this.smalo.minor);

  this.smalo.on('refresh', function(major, minor){
    debug({major: major, minor: minor, status: 'refresh'});
    self._value = new Buffer(String(major));
    if (self._updateValueCallback) {
        self._updateValueCallback(self._value);
    }
  });
}

util.inherits(SmaloMajorCharacteristic, BlenoCharacteristic);

SmaloMajorCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.info('[Read] MajorParameters Request offset: ' + offset);
  callback(this.RESULT_SUCCESS, this._value);
};

SmaloMajorCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.info('[onSubscribe] MajorParameters');

  this._updateValueCallback = updateValueCallback;
};

SmaloMajorCharacteristic.prototype.onUnsubscribe = function() {
  console.info('[onUnsubscribe] MajorParameters');

  this._updateValueCallback = null;
};

module.exports = SmaloMajorCharacteristic;