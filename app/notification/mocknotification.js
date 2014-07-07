
function MockNotification(notificationApi, pollingTime) {
  setInterval(function () {
    //TODO load json asset
    var state = {};
    notificationApi.sendPlayerstateChangedNotification(state);
  }, pollingTime);
};

module.exports = MockNotification;