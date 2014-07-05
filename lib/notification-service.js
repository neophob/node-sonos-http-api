
function NotificationApi(port) {
  var io = require('socket.io').listen(port);
  console.log('Start Notification Service on port ' + port);

  io.sockets.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('playerstate', function (data) {
      io.sockets.emit('playerstate', data);
    });

    socket.on('disconnect', function () {
      console.log('disconnect');
    });
  });

}

module.exports = NotificationApi;
