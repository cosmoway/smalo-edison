// bleno_ibeacon.js
var bleno = require('bleno');
var debug = require('debug')('smalo:ibeacon');
var config = require('config').ibeacon;

var uuid = config.uuid || '12345678-1234-1234-1234-ABCDEFGHIJKL';
var major = config.major || Math.floor(Math.random() * 65536);
var minor = config.minor || Math.floor(Math.random() * 65536);
var power = config.power || -59;

uuid = uuid.replace(/-/g, '').toLowerCase();

debug('bleno - iBeacon');
debug({ibeacon: {uuid: uuid, major: major, minor: minor, power: power}});

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
