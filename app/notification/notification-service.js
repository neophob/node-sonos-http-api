'use strict';

function NotificationApi(port, log) {
  var io = require('socket.io').listen(port);
  log.info('Start Socket.io notification service on port ' + port);

  io.sockets.on('connection', function (socket) {
    log.info('a user connected');

    socket.on('disconnect', function () {
      log.info('disconnect');
    });
  });

  this.sendPlayerstateChangedNotification = function (data) {
    io.sockets.emit('playerstate', data);
  };
}

module.exports = NotificationApi;
