// door.js
var mraa = require('mraa');
var duty_lock = 0.07;
var duty_unlock = 0.11;

var servo = new mraa.Pwm(20); // J18-7
servo.period_us(19500);

// 解錠処理
var unlock = function() {
  servo.enable(true);

  setTimeout(function() {
    // 解錠
    servo.write(duty_unlock);

    // GPIO を解放する。
    setTimeout(function() {
      servo.enable(false);
    }, 5000);
  }, 500);
};

// 施錠処理
var lock = function() {
  servo.enable(true);

  setTimeout(function() {
    // 施錠
    servo.write(duty_lock);

    // GPIOを解放する。
    setTimeout(function() {
      servo.enable(false);
    }, 5000);
  }, 500);
};

exports.unlock = unlock;
exports.lock = lock;


// デバッグ用
// usage: node door.js [unlock|lock]
{
  var command = process.argv[2];
  if (command == 'unlock') {
    unlock();
    console.log('Unlock.');
  } else if (command == 'lock') {
    lock();
    console.log('Lock.');
  }
}
