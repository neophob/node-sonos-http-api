'use strict';

var fs = require('fs');

function SonosApi(log) {

  var dataState = {};
  var dataPlaylist = {};
  var dataZones = {};
  var assetPath = './assets/';

  fs.readFile(assetPath + 'json/state.json', 'utf8', function (err, data) {
    if (err) {
      log.error('Error: ' + err);
      return;
    }
    dataState = JSON.parse(data);
  });
  fs.readFile(assetPath + 'json/playlists.json', 'utf8', function (err, data) {
    if (err) {
      log.error('Error: ' + err);
      return;
    }
    dataPlaylist = JSON.parse(data);
  });
  fs.readFile(assetPath + 'json/zones.json', 'utf8', function (err, data) {
    if (err) {
      log.error('Error: ' + err);
      return;
    }
    dataZones = JSON.parse(data);
  });

  // This is to handle setTimeout
  function pauseAll() {
  }

  function resumeAll() {
  }

  function restrictVolume(info) {
  }

  function browsePlaylist(id, callback) {
    callback(dataPlaylist);
  }

  function getPlayerState() {
    log.info('return state');
    return dataState;
  }

  function handleAction(options, callback) {
    log.debug(options);
    if (options.action === 'zones') {
      callback(dataZones);
      return;
    }

    if (options.action === 'preset') {
      callback();
      return;
    }

    if (options.action === 'lockvolumes') {
      callback();
      return;
    }

     if (options.action === 'unlockvolumes') {
       callback();
       return;
    }

    if (options.action === 'pauseall') {
      callback();
    }

    if (options.action === 'resumeall') {
      callback();
      return;
    }

    if (options.action === 'reindex') {
      callback();
      return;
    }

    switch (options.action.toLowerCase()) {
      case 'play':
        break;
      case 'pause':
        break;
      case 'playpause':
        break;
      case 'volume':
        break;
      case 'groupvolume':
        break;
      case 'mute':
        break;
      case 'unmute':
        break;
      case 'groupmute':
        break;
      case 'groupunmute':
        break;
      case 'state':
        var state = getPlayerState();
        callback(state);
        return;
      case 'seek':
        break;
      case 'trackseek':
        break;
      case 'ledoff':
        break;
      case 'ledon':
        break;
      case 'next':
        break;
      case 'previous':
        break;
      case 'setplaylist':
        break;
      case 'setavtransport':
        break;
      case 'setfavorite':
        break;
      case 'repeat':
        break;
      case 'shuffle':
        break;
      case 'favorites':
        browsePlaylist('FV:2', callback);
        return;
      case 'playlists':
        var queryName = 'SQ:';
        if (options.value && options.value.length > 0) {
          queryName = options.value;
        }
        log.debug('get playlist <' + queryName + '>');
        browsePlaylist(queryName, callback);
        return;
      default:
        log.warn('invalid parameter: ' + options.action);
        break;
      }

    callback();
  }

  //expose functions
  return {
    "handleAction":function(options, callback) { handleAction(options, callback) }
  };

}

module.exports = SonosApi;
