'use strict';

/*
 * Log using winston - 'a multi-transport async logging library for node.js'.
 * winston supports a big number of transports (ex. file, stdout, redis, http...)
 * see: https://github.com/flatiron/winston/blob/master/docs/transports.md
 *
 */

var winston = require('winston');
var conf = require('../conf');

var configured = false;

/*
 * configure winston based on some env variables defined in config.
 * configurable transports include:
 *  - Console (yes or no)
 *  - File (filename), Note: if no filename is specified this transport is disabled
 */
function configure() {
  if (configured) {
    return;
  }
  var level = conf.get('log.level');

  winston.remove(winston.transports.Console);

  if (/true/.test(conf.get('log.Console'))) {
    winston.add(winston.transports.Console, {
      timestamp: true,
      level: level
    });
  }

  if (conf.get('log.File')) {
    winston.add(winston.transports.DailyRotateFile, {
      timestamp: true,
      level: level,
      filename: conf.get('log.File')
    });
  }

}

/*
 * DUI Logger using winston
 */

function Log(label) {
  this.label = label || 'DUI';
}

/*
 * return wrapper around `winston.log`.
 * every log message is prefixed with a label. ex:
 *  - info: [ server ] Express server listening on port 3000
 */

Log._log = function (level, msg) {

  return function () {
    msg = '[ ' + this.label + ' ]';
    var args = [level, msg].concat(Array.prototype.slice.call(arguments));
    winston.log.apply(winston, args);
  };

};

/*
 * npm style logging levels
 */

Log.prototype.silly = Log._log('silly');
Log.prototype.debug = Log._log('debug');
Log.prototype.verbose = Log._log('verbose');
Log.prototype.info = Log._log('info');
Log.prototype.warn = Log._log('warn');
Log.prototype.error = Log._log('error');

module.exports = function (label) {

  if (!configured) {
    configure();
    configured = true;
  }

  return new Log(label);

};
