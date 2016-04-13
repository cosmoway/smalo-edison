var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloLockCharacteristic(smalo) {
  SmaloLockCharacteristic.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-unlock-characteristic'),
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
    // TODO: 書き込みデータのチェック
    // TODO: 成功したら、Slackへの通知
    // TODO: DBへの保存
    console.log([data, offset, withoutResponse, callback]);
    console.log('[Lock] Write Request offset: ' + offset);
    console.log('[Lock] Write Request: ' + data);
    console.log('[Lock] Write Request(hex): ' + data.toString('hex'));
    console.log('[Lock] Write Request(utf8): ' + data.toString('utf8'));
    callback(this.RESULT_SUCCESS);
    //callback(this.RESULT_ATTR_NOT_LONG);
};

module.exports = SmaloLockCharacteristic;
