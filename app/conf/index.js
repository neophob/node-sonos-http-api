'use strict';

var cache;

function config () {

  return {
    'log.level': process.env.LOG_LEVEL || 'info',
    'log.Console': process.env.LOG_CONSOLE || true,
    'log.File': process.env.LOG_FILE || '', //specify filename to log to or leave empty.
    'rest.port': process.env.REST_PORT || '5005',
    'rest.ip': process.env.REST_PORT || '0.0.0.0',
    'socket.port': process.env.REST_PORT || '5006',
    'polling.time': process.env.POLLING || '250'
  };
}

module.exports = {
  env: function () {
    return process.env.NODE_ENV || 'development';
  },
  get: function (key) {

    //lazy load config values
    if (!cache) {
      cache = config();
    }

    if (typeof cache[key] === 'undefined') {
      throw new Error('config key ' + key + ' not defined');
    }

    return cache[key];
  }
};
