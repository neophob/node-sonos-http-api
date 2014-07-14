var storedState = {};

function PlayerstateNotification(discovery, notificationApi, pollingTime) {
  setInterval(function() {
    discovery.getZones().forEach(function (zone) {
      var roomName = zone.coordinator.roomName;
      var state = zone.coordinator.state;
      var albumArtUri = state.currentTrack.albumArtURI;
      if (albumArtUri.startsWith('/')) {
        var playeraddress = discovery.getPlayerByUUID(zone.coordinator.uuid).address;
        var albumUrl = 'http://' + playeraddress + ':1400' + albumArtUri;
        state.currentTrack.albumArtURI = albumUrl;
      }
      //add current roomname, should be inside the coordinator code someday...
      state.roomname = roomName;

      if (storedState[roomName] === undefined) {
        storedState[roomName] = JSON.parse(JSON.stringify(state));
      }

      if (JSON.stringify(storedState[roomName]) !== JSON.stringify(state)) {
        storedState[roomName] = JSON.parse(JSON.stringify(state));
        notificationApi.sendPlayerstateChangedNotification(state);
      }
    });
  }, pollingTime);
}

module.exports = PlayerstateNotification;