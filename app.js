// app.js
//var config = require('config');
//var IBeacon = require('./lib/bleno_ibeacon');
var debug = require('debug')('smalo');
var WebSocket = require('ws');
var ws = new WebSocket('ws://smalo.cosmoway.net');

ws.on('open', function open(){
  debug('websocket connected.');
  ws.send(JSON.stringify({uuid: 'EFDA04E8-20DE-4A57-A01B-1C145BB2BA6B'}));
});

ws.on('message', function message(data, flags){
  debug('message received.');
  console.log(data, flags);
});

ws.on('error', function(error){
  debug('error occurred.');
  console.log(error);
});
