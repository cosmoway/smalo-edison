var noble = require('noble');
var mraa = require('mraa')

var myOnboardLed = new mraa.Gpio(13); 
myOnboardLed.dir(mraa.DIR_OUT); 

//BLEのための変数宣言
var serviceUUIDs = ['180d'];//Heart RateサービスのUUID
var characteristicUUIDs = ['2a37'];//Heart Rate Measurementに設定するキャラクタリスティクのUUID


//ペリフェラル検索のイベントに対するコールバック設定
noble.on('stateChange', function(state) {
    console.log('state: ' + state);
    if (state === 'poweredOn') {
        noble.startScanning();
    } else {
        noble.stopScanning();
    }
});

noble.on('scanStart', function() {
    console.log('start scan');
});

noble.on('scanStop', function() {
    console.log('stop scan');
});

noble.on('discover', discoverPeripheral);

//ペリフェラル発見時のコールバックメソッド
function discoverPeripheral(peripheral) {
    console.log('discover peripheral: ' + peripheral);
    noble.stopScanning();
    peripheral.connect();
 
   //ペリフェラル操作のイベントに対するコールバック設定
   peripheral.on('connect', function() {
       console.log('connect');
       this.discoverServices(serviceUUIDs);
   });

   peripheral.on('servicesDiscover', function(services){
       console.log(services);
       if(services.length > 0){
           var heartRateService = services[0];
           heartRateService.discoverCharacteristics(characteristicUUIDs);
           heartRateService.on('characteristicsDiscover', function(characteristics){
	       //取得したキャラクタリスティックをグローバル変数に格納する
               console.log('characteristics');
               var hrmCharacteristic = characteristics[0]
               hrmCharacteristic.notify(true);
               hrmCharacteristic.on('data',function(data, isNotification){
                   console.log(data);
                   myOnboardLed.write(1);
                   setTimeout(function(){myOnboardLed.write(0)}, 100);
               });
           });
           
       }else{peripheral.disconnect()}
   });
   
   //BLE切断時の処理、BLEデバイス切断時は再度ペリフェラルの検索を実行する。
   peripheral.on('disconnect', function() {
       console.log('on -> disconnect');
       noble.startScanning();
   });

}
