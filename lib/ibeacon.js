// ibeacon.js
var debug = require('debug')('smalo:ibeacon');
var events = require('events');
var exec = require('child_process').exec;
var util = require('util');

function refreshMajorAndMinor(beacon) {
  clearTimeout(beacon.timerId);

  beacon.major = Math.floor(Math.random() * 65536);
  beacon.minor = Math.floor(Math.random() * 65536);

  debug({ibeacon: {uuid: beacon.uuid, major: beacon.major, minor: beacon.minor, power: beacon.measuredPower}});

  var command = util.format(beacon._commandString, beacon.uuid, beacon.major, beacon.minor, beacon.measuredPower);
  exec(command, function(err, stdout, stderr) {
    console.log({err: err, stdout: stdout, stderr: stderr});
  });

  beacon.timerId = setTimeout(function(){
    refreshMajorAndMinor(beacon);
  }, beacon.refreshInterval);
}

function IBeacon() {
  events.EventEmitter.call(this);

  this.uuid = '51A4A738-62B8-4B26-A929-3BBAC2A5CE7C';
  this.major = Math.floor(Math.random() * 65536);
  this.minor = Math.floor(Math.random() * 65536);
  this.measuredPower = 200;
  this.timerId = undefined;
  this.refreshInterval = 1000 * 60;
  this._commandString = './ibeacon -z && ./ibeacon -u %s -M %d -m %d -p %d';
  var self = this;

  //debug({ibeacon: {uuid: this.uuid, major: this.major, minor: this.minor, power: this.measuredPower}});
  refreshMajorAndMinor(self);

  this.timerId = setTimeout(function(){
    refreshMajorAndMinor(self);
  }, this.refreshInterval);

  this.on('refresh', function(reason){
    debug('refresh reason: ' + reason);
    refreshMajorAndMinor(self);
  });
}

util.inherits(IBeacon, events.EventEmitter);

IBeacon.prototype.getMajor = function(){
  return this.major;
};

IBeacon.prototype.getMinor = function(){
  return this.minor;
};


module.exports = IBeacon;

