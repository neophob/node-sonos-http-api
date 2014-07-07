'use strict';

function SonosApi(log) {

  // This is to handle setTimeout
  function pauseAll() {
  }

  function resumeAll() {
  }

  function restrictVolume(info) {
  }

  function browsePlaylist(id, callback) {
    //TODO add playlist json
    var result = {};
    callback(result);
  }

  function getPlayerState() {
    //TODO add state json
    log.info('return state');
    var state = {};
    return state;
  }

  function handleAction(options, callback) {
    log.debug(options);
    if (options.action === 'zones') {
      //TODO add zones
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
