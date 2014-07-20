'use strict';

var http = require('http');
var optionparser = require('./optionparser');

function HttpApi(sonosApi, listeningip, port, presets, log) {

  var server = http.createServer(function (req, res) {
    var opt = optionparser(req.url);
    if (!opt.action) {
      res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf8',
        'Cache-Control': 'no-cache'
//        'Access-Control-Allow-Origin' : '*'
      });
      res.end();
      return;
    }

    sonosApi.handleAction(opt, function (response, img) {
      if (img) {
        res.writeHead(200, {'Content-Type': 'image/jpg',
          'Cache-Control': 'no-cache'
//          'Access-Control-Allow-Origin' : '*'
        });
        res.end(img, 'binary');
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/json;charset=utf8',
          'Cache-Control': 'no-cache'
//        'Access-Control-Allow-Origin' : '*'
        });
      }

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
