var util = require('util');
var bleno = require('bleno');
var BlenoPrimaryService = bleno.PrimaryService;

// characteristic
var SmaloUnlockCharacteristic = require('./smalo-unlock-characteristic');
var SmaloLockCharacteristic = require('./smalo-lock-characteristic');
var SmaloMajorCharacteristic = require('./smalo-major-characteristic');
var SmaloMinorCharacteristic = require('./smalo-minor-characteristic');
var SmaloLockStatusCharacteristic = require('./smalo-lock-status-characteristic');

function SmaloService(smalo){
  SmaloService.super_.call(this, {
    uuid: smalo.config.get('Uuids.smalo-service'),
    characteristics: [
      new SmaloUnlockCharacteristic(smalo), // 解錠
      new SmaloLockCharacteristic(smalo), // 施錠
      new SmaloMajorCharacteristic(smalo), // major
      new SmaloMinorCharacteristic(smalo), // minor
      new SmaloLockStatusCharacteristic(smalo) // 鍵の状態
    ]
  });
}

util.inherits(SmaloService, BlenoPrimaryService);

module.exports = SmaloService;
