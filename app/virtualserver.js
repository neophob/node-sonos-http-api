var http = require('http');
var conf = require('./conf');
var log = require('./lib/log')('sonosserver');

var HttpAPI = require('./rest/httpapi.js');
var MockSonosApi = require('./sonos-virtual/virtual-http-api.js');
var NotificationAPI = require('./notification/notification-service.js');
var MockNotification = require('./notification/mocknotification.js');
var socketioService = new NotificationAPI(conf.get('socket.port'), log);

var sonosApi = new MockSonosApi(log);
var httpAPI = new HttpAPI(sonosApi, conf.get('rest.ip'), conf.get('rest.port'), {}, log);
new MockNotification(socketioService, 2000);

process.on('SIGHUP', function() {
  log.info('SIGHUP, not implemented yet!');
});
process.on('uncaughtException', function(err) {
  log.error('uncaughtException detected! Exit application with Errorcode 1!');
  log.error('Stacktrace: ' + err.stack);
  process.exit(1);
});
