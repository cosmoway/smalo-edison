// app.js
var config = require('config');
var debug = require('debug')('smalo');
var WebSocket = require('ws');
var IBeacon = require('./lib/bleno-ibeacon');
var Door = require('./lib/door');
var door = new Door();
var registerDevice = require('./lib/register-device');

var attempts = 1;
var pingPongTimer;

// 鍵の位置を初期化
door.unlock();

createWebSocket();

function createWebSocket(){
  debug('connecting to ' + config.websocket.address);
  var ws = new WebSocket(config.websocket.address);
  var changeStatusListener = function(lockStatus){
    debug('lock status changed to ' + lockStatus);
    ws.send(JSON.stringify({state:lockStatus}), function(error){
      if (error) {
        debug('does not send lock status.');
        console.error(error);
      }
    });
  };

  ws.on('open', function(){
    debug('websocket connected.');
    var deviceUuid = config.door.uuid || '12345678-1111-2222-3333-ABCDEFGHIJKL';
    ws.send(JSON.stringify({uuid: deviceUuid}));
    ws.send(JSON.stringify({state: door.getStatus()}));

    // 試行回数をリセットする。
    attempts = 1;

    // 錠の状態が変更された時、通知する。
    door.on('changeStatus', changeStatusListener);

    // WebSocketの生存確認(Ping/Pong)
    pingPongTimer = setInterval(function(){
      debug('PING send.');
      try {
        ws.ping('PING');
      } catch (error) {
        console.error(error);
      }
    }, 30000);
  });

  ws.on('close', function(code, message){
    debug('websocket disconnected.');
    clearInterval(pingPongTimer);
    door.removeListener('changeStatus', changeStatusListener);

    var time = generateInterval(attempts);
    setTimeout(function(){
      attempts++;
      createWebSocket();
    }, time);
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
}

/**
 * 再接続時のインターバルを生成する。
 *
 * @param {number} k 再接続試行回数
 * @return {number} 再接続までの時間（ミリ秒）
 *
 * @see http://wazanova.jp/items/1189
 * @see http://blog.johnryding.com/post/78544969349/how-to-reconnect-web-sockets-in-a-realtime-web-app
 * @see https://gist.github.com/strife25/9310539
 */
function generateInterval(k) {
  return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
}

