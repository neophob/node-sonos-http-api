var http = require('http');
var conf = require('./conf');
var log = require('./lib/log')('sonosserver');
var fs = require('fs');

var SonosDiscovery = require('./sonos/sonos.js');
var HttpAPI = require('./rest/httpapi.js');
var SonosApi = require('./sonos/sonos-http-api.js');
var NotificationAPI = require('./notification/notification-service.js');
var PlayerstateNotification = require('./sonos/playerstatenotification.js');
var discovery = new SonosDiscovery(log);
var socketioService = new NotificationAPI(conf.get('socket.port'), log);

var presets = {};

fs.exists('./presets.json', function (exists) {
  if (exists) {
    presets = require('./presets.json');
    log.info('loaded presets', presets);
  }
});
var sonosApi = new SonosApi(discovery, presets, log);
new HttpAPI(sonosApi, conf.get('rest.ip'), conf.get('rest.port'), presets, log);
new PlayerstateNotification(discovery, socketioService, conf.get('polling.time'));

process.on('SIGHUP', function() {
  log.info('SIGHUP, not implemented yet!');
});
process.on('uncaughtException', function(err) {
  log.error('uncaughtException detected! Exit application with Errorcode 1!');
  log.error('Stacktrace: ' + err.stack);
  process.exit(1);
});
