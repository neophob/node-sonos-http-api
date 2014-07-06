var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var NotificationAPI = require('./lib/notification-service.js');
var fs = require('fs');

var discovery = new SonosDiscovery();
var portRestInterface = 5005;
var ipRestInterface = '0.0.0.0';
var portNotificationInterface = 5006;

var notificationApi = new NotificationAPI(portNotificationInterface);

var presets = {};
var storedState = {};

fs.exists('./presets.json', function (exists) {
	if (exists) {
		presets = require('./presets.json');
		console.log('loaded presets', presets);
	} else {
		console.log('no preset file, ignoring...');
	}
  var sonosHttpAPI = new SonosHttpAPI(discovery, ipRestInterface, portRestInterface, presets);

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
        console.log('send: '+state.currentTrack.title);
        storedState = JSON.parse(JSON.stringify(state));
        notificationApi.sendPlayerstateChangedNotification(state);
      }
    });
  }, 250);

});

