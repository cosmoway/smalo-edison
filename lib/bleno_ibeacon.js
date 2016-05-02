var bleno = require('bleno');
var debug = require('debug')('smalo:ibeacon');
var config = require('config').ibeacon;

var uuid = config.uuid.replace('/-/g', '').toLowerCase();
var major = config.major;
var minor = config.minor;
var power = config.power - 127;

debug('bleno - iBeacon');

bleno.on('stateChange', function(state) {
  debug('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertisingIBeacon(uuid, major, minor, power);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function() {
  debug('on -> advertisingStart');
});

bleno.on('advertisingStop', function() {
  debug('on -> advertisingStop');
});
