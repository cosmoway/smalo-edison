// register-device.js
var config = require('config');
var debug = require('debug')('smalo:register');
var https = require('https');

if (config.door.uuid === undefined || config.door.name === undefined) {
    debug('UUID: ' + config.door.uuid + ', NAME: ' + config.door.name);
    console.log('Undefined params uuid or name.');
    return;
}

var devices = {
    uuid: config.door.uuid,
    name: config.door.name,
    isLock: true
};

var options = config.apiserver;
options.path = '/api/v1/devices';
options.method = 'POST';
options.headers = {
    'Content-Type': 'application/json'
};

var postRequest = https.request(options, function(res){
    debug('HTTP Response StatusCode: ' + res.statusCode);
    console.log('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.on('data', function(chunk){
        debug('Recieve Data: ' + chunk);
        console.log('BODY: ' + chunk);
    });
});

postRequest.on('error', function(err){
    debug('Error: ' + err.message);
    console.error('register api errpr: ' + err.message);
})
;
postRequest.write(JSON.stringify(devices));
postRequest.end();
