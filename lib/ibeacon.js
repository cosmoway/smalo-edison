// ibeacon.js
var debug = require('debug')('smalo:ibeacon');
var exec = require('child_process').exec;
var util = require('util');

function IBeacon(params) {
  this.uuid = params.uuid || '12345678-1234-1234-1234-ABCDEFGHIJKL';
  this.major = params.major || Math.floor(Math.random() * 65536);
  this.minor = params.minor || Math.floor(Math.random() * 65536);
  this.measuredPower = params.power || 200;
  this._commandString = './ibeacon -z && ./ibeacon -u %s -M %d -m %d -p %d';

  debug({ibeacon: {uuid: this.uuid, major: this.major, minor: this.minor, power: this.measuredPower}});
  var command = util.format(this._commandString, this.uuid, this.major, this.minor, this.measuredPower);
  exec(command, function(err, stdout, stderr) {
    console.log({err: err, stdout: stdout, stderr: stderr});
  });
}

IBeacon.prototype.getUuid = function(){
  return this.uuid;
};

IBeacon.prototype.getMajor = function(){
  return this.major;
};

IBeacon.prototype.getMinor = function(){
  return this.minor;
};

module.exports = IBeacon;
