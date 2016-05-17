// app.js
var config = require('config');
var IBeacon = require('./lib/bleno-ibeacon');
var debug = require('debug')('smalo');

var door = require('./lib/door');

var DoorStatus = require('./lib/door-status');
var doorStatus = new DoorStatus();

var registerDevice = require('./lib/register-device');

var WebSocket = require('ws');
var ws = new WebSocket(config.websocket.address);

ws.on('open', function(){
  debug('websocket connected.');
  var deviceUuid = config.door.uuid || '12345678-1111-2222-3333-ABCDEFGHIJKL';
  ws.send(JSON.stringify({uuid: deviceUuid}));
  ws.send(JSON.stringify({status: doorStatus.getStatus()}));
});

ws.on('message', function(data, flags){
  debug('message received.');
  console.log(data, flags);
  try{
    var messageJson = JSON.parse(data);
  } catch (error) {
    console.error(error);
    return;
  }

  var command = messageJson.command;
  if (command === undefined) {
      debug('does not lock/unlock request.');
      console.error('does not lock/unlock request.');
      return;
  }

  if (command === 'lock') {
    debug('execute door locking...');
    door.lock();
  }

  if (command === 'unlock') {
    debug('execute door unlocking...');
    door.unlock();
  }
});

ws.on('error', function(error){
  debug('error occurred.');
  console.log(error);
});

// 鍵の状態が変更された時、通知する。
doorStatus.on('changeStatus', function(lockStatus){
  debug('lock status changed to ' + lockStatus);
  ws.send(JSON.stringify({state:lockStatus}), function(error){
    if (error) {
      debug('does not send lock status.');
      console.error(error);
    }
  });
});

// WebSocketの生存確認(Ping/Pong)
setInterval(function(){
  debug('PING send.');
  try {
    ws.ping('PING');
  } catch (error) {
    console.error(error);
  }
}, 30000);

ws.on('pong', function(data, flags){
  debug('PONG received: ' + data.toString());
});

ws.on('ping', function(data, flags){
  debug('PING received: ' + data.toString());
  try {
    ws.pong('PONG');
  } catch (error) {
    console.error(error);
  }
});

// TODO: 切断された場合の再接続は？
ws.on('close', function(code, message){
  debug('websocket disconnected.');
});
