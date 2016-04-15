var util = require('util');
var bleno = require('bleno');
var debug = require('debug')('smalo:characteristic:lock');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloLockCharacteristic(smalo) {
  SmaloLockCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-lock-characteristic'),
    properties: ['write'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Lock Request'
      })
    ]
  });
  this.smalo = smalo;
}

util.inherits(SmaloLockCharacteristic, BlenoCharacteristic);

SmaloLockCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

  
  debug('[Lock] Write Request: ' + data);
  debug('[Lock] Write Request(hex): ' + data.toString('hex'));
  debug('[Lock] Write Request(utf8): ' + data.toString('utf8'));

  if (offset) {
    debug('lock request error by offset.');
    callback(this.RESULT_ATTR_NOT_LONG);
  } else if (this.smalo.auth(data.toString('utf8'), 'lock') === false) {
    debug('lock request error by invalid data.');
    callback(this.RESULT_UNLIKELY_ERROR)
  } else {
    debug('lock request success!');
    callback(this.RESULT_SUCCESS);
  }
};

module.exports = SmaloLockCharacteristic;
