// app.js
var config = require('config');
var IBeacon = require('./lib/bleno_ibeacon');
var debug = require('debug')('smalo');

var DoorStatus = require('./lib/door-status');
var doorStatus = new DoorStatus();

var WebSocket = require('ws');
var ws = new WebSocket(config.websocket.address);

ws.on('open', function(){
  debug('websocket connected.');
  ws.send(JSON.stringify({uuid: config.door.uuid || '12345678-1111-2222-3333-ABCDEFGHIJKL'}));
  ws.send(JSON.stringify({status: doorStatus.getStatus()}));
});

ws.on('message', function(data, flags){
  debug('message received.');
  console.log(data, flags);
});

ws.on('error', function(error){
  debug('error occurred.');
  console.log(error);
});

// 鍵の状態が変更された時、通知する。
doorStatus.on('changeStatus', function(lockStatus){
  debug('lock status changed to ' + lockStatus);
  ws.send(JSON.stringify({state:lockStatus}));
});

// WebSocketの生存確認(Ping/Pong)
setInterval(function(){
  debug('PING send.');
  ws.ping('PING');
}, 30000);

ws.on('pong', function(data, flags){
  debug('PONG received: ' + data.toString());
});

ws.on('ping', function(data, flags){
  ws.pong('PONG');
  debug('PING received: ' + data.toString());
});
