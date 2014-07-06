'use strict';

var cache;

function config () {

  return {
    'port': process.env.PORT || 3000,
    'ip': process.env.IP || '127.0.0.1',
    'db.name': process.env.DB_NAME || 'dui_dev',
    'db.host': process.env.DB_HOST || 'localhost',
    'db.user': process.env.DB_USER || 'dui_dev',
    'db.pwd': process.env.DB_PWD || 'just4dui',
    'db.dialect': process.env.DB_DIALECT || 'postgres',
    'db.storage': process.env.DB_STORAGE || null,
    'db.logging': process.env.DB_LOGGING || false,
    'db.pooling.size': process.env.DB_POOLING_SIZE || 10,
    'db.pooling.timeout': process.env.DB_POOLING_TIMEOUT || 60,
    'log.level': process.env.LOG_LEVEL || 'info',
    'log.Console': process.env.LOG_CONSOLE || true,
    'log.File': process.env.LOG_FILE || '' //specify filename to log to or leave empty.
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
