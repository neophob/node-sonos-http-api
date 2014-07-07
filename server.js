var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var NotificationAPI = require('./notification/notification-service.js');
var PlayerstateNotification = require('./notification/playerstatenotification.js');
var fs = require('fs');
var conf = require('./conf');
var log = require('./lib/log')('sonosserver');

var discovery = new SonosDiscovery();
var notificationApi = new NotificationAPI(conf.get('socket.port'), log);

var presets = {};

fs.exists('./presets.json', function (exists) {
  if (exists) {
    presets = require('./presets.json');
    log.info('loaded presets', presets);
  }
});
var sonosHttpAPI = new SonosHttpAPI(discovery, conf.get('rest.ip'), conf.get('rest.port'), presets, log);
new PlayerstateNotification(discovery, notificationApi, conf.get('polling.time'));

process.on('SIGHUP', function() {
  log.info('SIGHUP, not implemented yet!');
});
process.on('uncaughtException', function(err) {
  log.error('uncaughtException detected! Exit application with Errorcode 1!');
  log.error('Stacktrace: ' + err.stack);
  process.exit(1);
});
