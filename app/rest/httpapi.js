'use strict';

var http = require('http');

function HttpApi(sonosApi, listeningip, port, presets, log) {

  var server = http.createServer(function (req, res) {
    res.writeHead(200, {
      'Content-Type': 'application/json;charset=utf8',
      'Cache-Control': 'no-cache',
	    'Access-Control-Allow-Origin' : '*'
    });

    var params = req.url.substring(1).split('/');

    if (params.length < 1 || params[0] === 'favicon.ico') {
      // This is faulty.
      res.end();
      return;
    } else if (params.length === 2 && ['preset', 'pauseall', 'resumeall', 'reindex'].some(function (i) { return params[0] === i; })) {
      // Handle presets
      var opt = {
        action: params[0],
        value: params[1]
      };
    } else if (params.length > 1) {
      var opt = {
        room: params[0],
        action: params[1],
        value: params[2]
      };
    } else {
      // guessing zones
      var opt = {
        action: params[0]
      }
    }

    var response = sonosApi.handleAction(opt, function (response) {
      if (response) {
        var jsonResponse = JSON.stringify(response);
        res.write(new Buffer(jsonResponse));
      }
      res.end();
    });
  });

  server.listen(port, listeningip);
  log.info('http server listening on port', port);
}

module.exports = HttpApi;
