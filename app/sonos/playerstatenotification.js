var storedState = {};

function PlayerstateNotification(discovery, notificationApi, pollingTime) {
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
  }, pollingTime);
}

module.exports = PlayerstateNotification;