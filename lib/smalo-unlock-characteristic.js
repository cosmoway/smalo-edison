var util = require('util');
var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

function SmaloUnlockCharacteristic(smalo) {
    SmaloUnlockCharacteristic.super_.call(this, {
        uuid: 'c295a114-157d-4ba6-a788-37121cc04f51',
        properties: ['write'],
        descriptors: [
            new BlenoDescriptor({
                uuid: '2901', // 仮
                value: 'Unlock Request' // 仮
            })
        ]
    });
    this.smalo = smalo;
}

util.inherits(SmaloUnlockCharacteristic, BlenoCharacteristic);

SmaloUnlockCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    // TODO: 書き込みデータのチェック
    // TODO: 成功したら、Slackへの通知
    // TODO: DBへの保存
    console.log([data, offset, withoutResponse, callback]);
    console.log('[UnLock] Write Request offset: ' + offset);
    console.log('[UnLock] Write Request: ' + data);
    console.log('[UnLock] Write Request(hex): ' + data.toString('hex'));
    console.log('[UnLock] Write Request(utf8): ' + data.toString('utf8'));
    callback(this.RESULT_SUCCESS);
    //callback(this.RESULT_ATTR_NOT_LONG);
};

module.exports = SmaloUnlockCharacteristic;
