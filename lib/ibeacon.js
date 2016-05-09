// ibeacon.js
var debug = require('debug')('smalo:ibeacon');
var exec = require('child_process').exec;
var util = require('util');
var config = require('config').ibeacon;

var uuid = config.uuid || '12345678-1234-1234-1234-ABCDEFGHIJKL';
var major = config.major || Math.floor(Math.random() * 65536);
var minor = config.minor || Math.floor(Math.random() * 65536);
var measuredPower = config.power || 200;
var commandString = './ibeacon -z && ./ibeacon -u %s -M %d -m %d -p %d';

debug({ibeacon: {uuid: uuid, major: major, minor: minor, power: measuredPower}});
var command = util.format(commandString, uuid, major, minor, measuredPower);
exec(command, function(err, stdout, stderr) {
  console.log({err: err, stdout: stdout, stderr: stderr});
});
