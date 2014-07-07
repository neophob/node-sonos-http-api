'use strict';

function SonosApi(discovery, presets, log) {

  var lockVolumes = {};
  var pauseState = {};

  // This is to handle setTimeout
  function pauseAll() {
    pauseState = {};
    discovery.getZones().forEach(function (zone) {
      pauseState[zone.uuid] = zone.coordinator.state.zoneState;
      if (pauseState[zone.uuid] === 'PLAYING') {
        var player = discovery.getPlayerByUUID(zone.uuid);
        player.pause();
      }
    });
  }

  function resumeAll() {
    // save state for resume
    for (var uuid in pauseState) {
      if (pauseState[uuid] === 'PLAYING') {
        var player = discovery.getPlayerByUUID(uuid);
        player.play();
      }
    }
    // Clear the pauseState to prevent a second resume to raise hell
    pauseState = {};
  }

  function restrictVolume(info) {
    log.info('should revert volume to', lockVolumes[info.uuid]);
    var player = discovery.getPlayerByUUID(info.uuid);
    // Only do this if volume differs
    if (player.state.volume != lockVolumes[info.uuid])
      player.setVolume(lockVolumes[info.uuid]);
  }

  function browsePlaylist(player, id, callback) {
    player.browse(id, null, null, function (success, result) {
      if(!success){
        callback(false);
        return;
      }
      //replace albumart uri with absolute url
      for(var i=0;i<result.items.length;i++){
        var item = result.items[i];
        var albumArtUri = item.albumArtURI;
        if (albumArtUri && albumArtUri.startsWith('/')) {
          item.albumArtURI = 'http://' + player.address + ':1400' + albumArtUri;
        }
      }
      callback(result);
    });
  }

  function getPlayerState(player) {
    var state = player.getState();
    var albumArtUri = state.currentTrack.albumArtURI;
    if (albumArtUri.startsWith('/')) {
      var albumUrl = 'http://' + player.address + ':1400' + albumArtUri;
      state.currentTrack.albumArtURI = albumUrl;
    }
    return state;
  }

  function handleAction(options, callback) {
    log.debug(options);
    if (options.action === 'zones') {
      callback(discovery.getZones());
      return;
    }

    if (options.action === 'preset') {
      // Apply preset
      var value = decodeURIComponent(options.value);
      if (value.startsWith('{')) {
        var preset = JSON.parse(value);
      } else {
        var preset = presets[value];
      }

      if (preset) {
        log.debug('applying preset', preset);
        discovery.applyPreset(preset);
      }
      callback();
      return;
    }

    if (options.action === 'lockvolumes') {
      log.debug('locking volumes');
      // Locate all volumes
      for (var i in discovery.players) {
        var player = discovery.players[i];
        lockVolumes[i] = player.state.volume;
      }
      // prevent duplicates, will ignore if no event listener is here
      discovery.removeListener('volume', restrictVolume);
      discovery.on('volume', restrictVolume);
      callback();
      return;
    }

     if (options.action === 'unlockvolumes') {
       log.debug('unlocking volumes');
       discovery.removeListener('volume', restrictVolume);
       callback();
       return;
    }

    if (options.action === 'pauseall') {
      log.debug('pausing all players');
      // save state for resume
      if (options.value && options.value > 0) {
        log.debug('in', options.value, 'minutes');
        setTimeout(function () { pauseAll(); }, options.value*1000*60);
      } else {
        pauseAll();
      }
      callback();
    }

    if (options.action === 'resumeall') {
      log.debug('resuming all players');
      if (options.value && options.value > 0) {
        log.debug('in', options.value, 'minutes');
        setTimeout(function () { resumeAll(); }, options.value*1000*60);
      } else {
        resumeAll();
      }
      callback();
      return;
    }

    if (options.action === 'reindex') {
      // Find first player available.
      var player = discovery.getAnyPlayer();
      if (player) {
        player.refreshShareIndex(callback);
      } else {
        callback();
      }
      return;
    }

    var roomName = decodeURIComponent(options.room);
    var player = discovery.getPlayer(roomName);
    if (!player) {
      callback();
      return;
    }

    switch (options.action.toLowerCase()) {
      case 'play':
        player.coordinator.play();
        break;
      case 'pause':
        player.coordinator.pause();
        break;
      case 'playpause':
        if(player.coordinator.state['currentState'] === 'PLAYING') {
          player.coordinator.pause();
        } else {
          player.coordinator.play();
        }
        break;
      case 'volume':
        player.setVolume(options.value);
        break;
      case 'groupvolume':
        player.coordinator.groupSetVolume(options.value);
        break;
      case 'mute':
        player.mute(true);
        break;
      case 'unmute':
        player.mute(false);
        break;
      case 'groupmute':
        player.coordinator.groupMute(true);
        break;
      case 'groupunmute':
        player.coordinator.groupMute(false);
        break;
      case 'state':
        var state = getPlayerState(player);
        callback(state);
        return;
      case 'seek':
        player.coordinator.seek(options.value);
        break;
      case 'trackseek':
        player.coordinator.trackSeek(options.value*1);
        break;
      case 'ledoff':
        player.toggleLED(false);
        break;
      case 'ledon':
        player.toggleLED(true);
        break;
      case 'next':
        player.coordinator.nextTrack();
        break;
      case 'previous':
        player.coordinator.previousTrack();
        break;
      case 'setplaylist':
        if (options.value && options.value.length > 0) {
          player.replaceQueueWithPlaylist(decodeURIComponent(options.value), function (success) {
            if (success) {
              player.coordinator.play();
            }
          });
        }
        break;
      case 'setavtransport':
        player.setAVTransportURI(options.value, '');
        break;
      case 'setfavorite':
        player.coordinator.replaceWithFavorite(options.value, function (success) {
          if (success) {
            player.coordinator.play();
          }
        });
        break;
      case 'repeat':
        player.coordinator.repeat(options.value === 'on' ? true : false);
        break;
      case 'shuffle':
        player.coordinator.shuffle(options.value === 'on' ? true : false);
        break;
      case 'favorites':
        browsePlaylist(player, 'FV:2', callback);
        return;
      case 'playlists':
        var queryName = 'SQ:';
        if (options.value && options.value.length > 0) {
          queryName = options.value;
        }
        log.debug('get playlist <' + queryName + '>');
        browsePlaylist(player, queryName, callback);
        return;
      default:
        log.warn('invalid parameter: ' + options.action);
        break;
      }

    callback();
  };

  //expose functions
  return {
     "handleAction":function(options, callback) { handleAction(options, callback) }
  };

}

module.exports = SonosApi;
