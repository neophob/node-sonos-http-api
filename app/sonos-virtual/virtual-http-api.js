'use strict';

var fs = require('fs');

function SonosApi(log, ip, port) {

  var hostaddr = 'http://'+ip+':'+port;
  var pauseState = false;
  var muteState = false;
  var volume = 1;
  var dataStateWohnzimmer = {};
  var dataStateKueche = {};
  var dataPlaylist = {};
  var dataPlaylistFV2 = {};
  var dataPlaylistSQ1 = {};
  var dataPlaylistSQ0 = {};
  var dataPlaylistA = {};
  var dataZones = {};
  var coverimages = [];
  var assetPath = './assets/';

  function loadJSONFile(filename) {
    log.debug('load filename '+filename);
    var data = fs.readFileSync(assetPath + filename, 'utf8');
    return JSON.parse(data);
  }

  function replaceAlbumArtUri(data) {
    var items = data.items;
    var nr = 0;
    for (var i in items) {
      var ofs = nr%3;
      items[i].albumArtURI = hostaddr + '/img/cover'+ofs+'.jpg';
      nr++;
    }
  }

  //synchronous read of required files...
  dataStateWohnzimmer = loadJSONFile('json/stateWohnzimmer.json');
  dataStateKueche = loadJSONFile('json/stateKueche.json');
  dataPlaylist = loadJSONFile('json/playlists.json');
  dataPlaylistFV2 = loadJSONFile('json/playlistsFV2.json');
  dataPlaylistSQ1 = loadJSONFile('json/playlistsSQ1.json');
  replaceAlbumArtUri(dataPlaylistSQ1);
  dataPlaylistSQ0 = loadJSONFile('json/playlistsSQ0.json');
  replaceAlbumArtUri(dataPlaylistSQ0);
  dataPlaylistA = loadJSONFile('json/playlistsA.json');
  dataZones = loadJSONFile('json/zonesTwoZonesWithOnePlayer.json');

  coverimages['cover0.jpg'] = fs.readFileSync(assetPath + 'img/cover0.jpg');
  coverimages['cover1.jpg'] = fs.readFileSync(assetPath + 'img/cover1.jpg');
  coverimages['cover2.jpg'] = fs.readFileSync(assetPath + 'img/cover2.jpg');

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

  function getPlayerState(name) {
    var dataState;
    var img;
    if (name === 'Wohnzimmer') {
      dataState = dataStateWohnzimmer;
      img = '/img/cover1.jpg';
    } else {
      dataState = dataStateKueche;
      img = '/img/cover2.jpg'
    }

    var pauseStateString = 'PAUSED_PLAYBACK';
    if (!pauseState) {
      pauseStateString = 'PLAYING';
      dataState.elapsedTime = new Date().getSeconds();
    }
    dataState.zoneState = pauseStateString;
    dataState.playerState = pauseStateString;
    dataState.volume = parseInt(volume, 10);
    dataState.currentTrack.albumArtURI = hostaddr + img;
    dataState.mute = muteState;
    return dataState;
  }

  function getZones() {
    return dataZones;
  }

  function handleAction(options, callback) {
    log.debug(options);

    //room=img, action=aa.jpg, value=undefined
    if (options.room === 'img' && options.value === undefined) {
      callback(null, coverimages[options.action]);
      return;
    }

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
        muteState = true;
        break;
      case 'unmute':
        muteState = false;
        break;
      case 'groupmute':
        muteState = true;
        break;
      case 'groupunmute':
        muteState = false;
        break;
      case 'state':
        var state = getPlayerState(options.room);
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
    "getPlayState":function(name){return getPlayerState(name);},
    "getZones":function(){return getZones();}
  };

}

module.exports = SonosApi;
