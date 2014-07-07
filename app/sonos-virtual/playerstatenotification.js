var storedState = {};

function MockNotification(sonosApi, notificationApi, pollingTime) {
  setInterval(function () {
    var state = sonosApi.getPlayState();
    if (JSON.stringify(storedState) !== JSON.stringify(state)) {
      storedState = JSON.parse(JSON.stringify(state));
      notificationApi.sendPlayerstateChangedNotification(state);
    }
  }, pollingTime);
};

module.exports = MockNotification;