var util = require('util');
var bleno = require('bleno');
var debug = require('debug')('smalo:characteristic:unlock');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloUnlockCharacteristic(smalo) {
  SmaloUnlockCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-unlock-characteristic'),
    properties: ['write'],
    descriptors: [
      new BlenoDescriptor({
        uuid: '2901',
        value: 'Unlock Request'
      })
    ]
  });
  this.smalo = smalo;
}

util.inherits(SmaloUnlockCharacteristic, BlenoCharacteristic);

SmaloUnlockCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {

  debug('[UnLock] Write Request(utf8): ' + data.toString('utf8'));

  if (offset) {
    debug('unlock request error by offset.');
    callback(this.RESULT_ATTR_NOT_LONG);
  } else if (this.smalo.auth(data.toString('utf8'), 'unlock') === false) {
    debug('unlock request error by invalid data or device.');
    callback(this.RESULT_UNLIKELY_ERROR)
  } else {
    debug('unlock request success!');
    callback(this.RESULT_SUCCESS);
  }
};

module.exports = SmaloUnlockCharacteristic;
