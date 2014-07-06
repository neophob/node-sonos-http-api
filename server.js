var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var NotificationAPI = require('./lib/notification-service.js');
var fs = require('fs');
var conf = require('./conf');
var log = require('./lib/log')('sonosserver');

var discovery = new SonosDiscovery();
var notificationApi = new NotificationAPI(conf.get('socket.port'), log);

var presets = {};
var storedState = {};

fs.exists('./presets.json', function (exists) {
	if (exists) {
		presets = require('./presets.json');
    log.info('loaded presets', presets);
	}
  var sonosHttpAPI = new SonosHttpAPI(discovery, conf.get('rest.ip'), conf.get('rest.port'), presets, log);

  setInterval(function() {
    discovery.getZones().forEach(function (zone) {
      var state = zone.coordinator.state;
      var albumArtUri = state.currentTrack.albumArtURI;
      if (albumArtUri.startsWith('/')) {
        var playeraddress = discovery.getPlayerByUUID(zone.coordinator.uuid).address;
        var albumUrl = 'http://' + playeraddress + ':1400' + albumArtUri;
        state.currentTrack.albumArtURI = albumUrl;
      }
      if (JSON.stringify(storedState) !== JSON.stringify(state)) {
        storedState = JSON.parse(JSON.stringify(state));
        notificationApi.sendPlayerstateChangedNotification(state);
      }
    });
  }, conf.get('polling.time'));
});


process.on('SIGHUP', function() {
  log.info('SIGHUP, not implemented yet!');
  //TODO maybe reparse process.env?
});
process.on('uncaughtException', function(err) {
  log.error('uncaughtException detected! Exit application with Errorcode 1!');
  log.error('Stacktrace: ' + err.stack);
  process.exit(1);
});
