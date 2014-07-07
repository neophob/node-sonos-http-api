'use strict';

var fs = require('fs');

function SonosApi(log) {

  var pauseState = false;
  var volume = 1;
  var dataState = {};
  var dataPlaylist = {};
  var dataPlaylistFV2 = {};
  var dataPlaylistSQ1 = {};
  var dataPlaylistSQ0 = {};
  var dataPlaylistA = {};
  var dataZones = {};
  var assetPath = './assets/';

  function loadFile(filename, callback) {
    fs.readFile(assetPath + filename, 'utf8', function (err, data) {
      if (err) {
        log.error('Error: ' + err);
        callback({});
      }
      callback(JSON.parse(data));
    });
  }

  loadFile('json/state.json', function(data) {
    dataState = data;
  });
/*  fs.readFile(assetPath + 'json/state.json', 'utf8', function (err, data) {
    if (err) {
      log.error('Error: ' + err);
      return;
    }
    dataState = JSON.parse(data);
  });*/
  loadFile('json/playlists.json', function(data) {
    dataPlaylist = data;
  });
  loadFile('json/playlistsFV2.json', function(data) {
    dataPlaylistFV2 = data;
  });
  loadFile('json/playlistsSQ1.json', function(data) {
    dataPlaylistSQ1 = data;
  });
  loadFile('json/playlistsSQ0.json', function(data) {
    dataPlaylistSQ0 = data;
  });
  loadFile('json/playlistsA.json', function(data) {
    dataPlaylistA = data;
  });
  loadFile('json/zones.json', function(data) {
    dataZones = data;
  });

  // This is to handle setTimeout
  function pauseAll() {
    pauseState = true;
  }

  function resumeAll() {
    pauseState = false;
  }

  function restrictVolume(info) {
  }

  function browsePlaylist(id, callback) {
    log.info('browsePlaylist: '+id);
    if (id === 'FV:2') {
      callback(dataPlaylistFV2);
      return;
    } else
    if (id === 'SQ:1') {
      callback(dataPlaylistSQ1);
      return;
    } else
    if (id === 'SQ:0') {
      callback(dataPlaylistSQ0);
      return;
    } else
    if (id === 'A:') {
      callback(dataPlaylistA);
      return;
    }
    callback(dataPlaylist);
  }

  function getPlayerState() {
    var pauseStateString = 'PAUSED_PLAYBACK';
    if (!pauseState) {
      pauseStateString = 'PLAYING';
      dataState.elapsedTime = new Date().getSeconds();
    }
    dataState.zoneState = pauseStateString;
    dataState.playerState = pauseStateString;
    dataState.volume = parseInt(volume, 10);
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
        pauseState = false;
        break;
      case 'pause':
        pauseState = true;
        break;
      case 'playpause':
        if (pauseState) {
          pauseState = false;
        } else {
          pauseState = true;
        }
        break;
      case 'volume':
        volume = options.value;
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
    "handleAction":function(options, callback) { handleAction(options, callback) },
    "getPlayState":function(){return getPlayerState();}
  };

}

module.exports = SonosApi;
