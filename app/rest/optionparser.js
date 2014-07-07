'use strict';

module.exports = function(url) {
  var params = url.substring(1).split('/');
  var opt = {};

  if (params.length < 1 || params[0] === 'favicon.ico') {
    // This is faulty.
    return opt;
  } else if (params.length === 2 && ['preset', 'pauseall', 'resumeall', 'reindex'].some(function (i) { return params[0] === i; })) {
    // Handle presets
    opt = {
      action: params[0],
      value: params[1]
    };
  } else if (params.length > 1) {
    opt = {
      room: params[0],
      action: params[1],
      value: params[2]
    };
  } else {
    // guessing zones
    opt = {
      action: params[0]
    };
  }

  return opt;
};
