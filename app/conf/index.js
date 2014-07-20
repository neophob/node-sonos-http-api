'use strict';

var cache;

function config () {

  return {
    'log.level': process.env.LOG_LEVEL || 'debug',
    'log.Console': process.env.LOG_CONSOLE || true,
    'log.File': process.env.LOG_FILE || '', //specify filename to log to or leave empty.
    'rest.port': process.env.REST_PORT || '5005',
    'rest.ip': process.env.REST_IP || '0.0.0.0',
    'socket.port': process.env.SOCKET_PORT || '5006',
    'polling.time': process.env.POLLING || '250',
    'virtual.sonos.ip': process.env.VIRTUAL_SONOS_IP || '127.0.0.1',
    'virtual.image.url': process.env.VIRTUAL_IMAGE_URL || '/api'
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
