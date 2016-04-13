var bleno = require('bleno');
var moment = require('moment');
var debug = require('debug')('peripheral');
var Smalo = require('./smalo')
var smalo = new Smalo();

var serviceUuids = smalo.config.get('Uuids.smalo-service');

var SmaloService = require('./smalo-service');
var smaloService = new SmaloService(smalo);

// デバイス名を変更
process.env['BLENO_DEVICE_NAME'] = process.env['BLENO_DEVICE_NAME'] || smalo.config.get('Advertise.LocalName');
// アドバタイズのインターバルを変更（デフォルト:100ms）
process.env['BLENO_ADVERTISING_INTERVAL'] = 100;

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('smalo', [serviceUuids]);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      smaloService
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('bleno on -> advertisingStop');
});

bleno.on('servicesSet', function() {
  console.log('bleno on -> servicesSet');
});

bleno.on('accept', function(clientAddress) {
  console.log('Accept connection from: ' + clientAddress);
});

bleno.on('disconnect', function(clientAddress) {
  console.log('Disconnected connection with: ' + clientAddress);
});
