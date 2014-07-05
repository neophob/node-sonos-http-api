var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var NotificationAPI = require('./lib/notification-service.js');
var fs = require('fs');

var discovery = new SonosDiscovery();
var portRestInterface = 5005;
var portNotificationInterface = 5006;

var notificationApi = new NotificationAPI(portNotificationInterface);

var presets = {};
fs.exists('./presets.json', function (exists) {
	if (exists) {
		presets = require('./presets.json');
		console.log('loaded presets', presets);
	} else {
		console.log('no preset file, ignoring...');
	}
	new SonosHttpAPI(discovery, portRestInterface, presets, notificationApi);
});

