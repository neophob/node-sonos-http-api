var storedState = {};

function MockNotification(sonosApi, notificationApi, pollingTime) {
  setInterval(function () {
    /*
     var state = sonosApi.getPlayState();
     if (JSON.stringify(storedState) !== JSON.stringify(state)) {
     storedState = JSON.parse(JSON.stringify(state));
     notificationApi.sendPlayerstateChangedNotification(state);
     }
     */
    sonosApi.getZones().forEach(function (zone) {
      var roomName = zone.coordinator.roomName;
      var state = sonosApi.getPlayState(roomName);
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
};

module.exports = MockNotification;