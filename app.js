// app.js
var config = require('config');
var IBeacon = require('./lib/ibeacon');

// iBeacon スタート
var ibeacon = new IBeacon(config.ibeacon);

