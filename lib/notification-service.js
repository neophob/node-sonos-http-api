
function NotificationApi(port) {
  var io = require('socket.io').listen(port);
  console.log('Start Notification Service on port ' + port);

  io.sockets.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('disconnect', function () {
      console.log('disconnect');
    });
  });

  io.sockets.on('hi', function (socket) {
    console.log('client says hi');
  });

  this.sendPlayerstateChangedNotification = function (data) {
    io.sockets.emit('playerstate', data);
  }

}

module.exports = NotificationApi;
