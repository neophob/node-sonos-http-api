'use strict';

var expect = require('chai').expect;
var winston = require('winston');
var SonosApi = require('../../app/sonos-virtual/virtual-http-api.js');
var optionparser = require('../../app/rest/optionparser');

var logger = new (winston.Logger)({
  transports: [
    //new (winston.transports.File)({ filename: 'foo.log' })
    new (winston.transports.Console)()
  ]
});

describe('Check Sonos Virtual Device', function() {

  describe('check image url', function() {
    it('should return an albumArtURI with provided parameter', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);

      //WHEN
      var result = sonosApi.getPlayState();

      //THEN
      expect(result.currentTrack.albumArtURI).to.contain('http://'+ip+':'+port);
      expect(result.currentTrack.albumArtURI).to.contain('cover');
    });
  });

  describe('play state', function() {
    it('should return play state ', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/PLAY');

      //WHEN
      sonosApi.handleAction(action, function(reply) {
      });

      //THEN
      var result = sonosApi.getPlayState();
      expect(result.zoneState).to.be.equal('PLAYING');
      expect(result.playerState).to.be.equal('PLAYING');
    });
  });

  describe('pause state', function() {
    it('should return pause state ', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/PAUSE');

      //WHEN
      sonosApi.handleAction(action, function(reply) {
      });

      //THEN
      var result = sonosApi.getPlayState();
      expect(result.zoneState).to.be.equal('PAUSED_PLAYBACK');
      expect(result.playerState).to.be.equal('PAUSED_PLAYBACK');
    });
  });

  describe('set volume', function() {
    it('should return updated volume', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var volume = 44;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/volume/'+volume);

      //WHEN
      sonosApi.handleAction(action, function(reply) {
      });

      //THEN
      var result = sonosApi.getPlayState();
      expect(result.volume).to.be.equal(volume);
    });
  });

  describe('get favorites', function() {
    it('should return favorites list', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/favorites');

      //WHEN
      sonosApi.handleAction(action, function(reply) {

        //THEN
        var result = JSON.stringify(reply.items);
        expect(result).to.contain("I'm feeling lucky mix");
      });
    });
  });

  describe('get default playlist', function() {
    it('should return default playlist (SQ:)', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/playlists');

      //WHEN
      sonosApi.handleAction(action, function(reply) {

        //THEN
        var result = JSON.stringify(reply.items);
        expect(result).to.contain('bern electro');
      });
    });
  });

  describe('get specific playlist', function() {
    it('should return playlist SQ:0', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/WOHNZIMMER/playlists/SQ:0');

      //WHEN
      sonosApi.handleAction(action, function(reply) {

        //THEN
        var result = JSON.stringify(reply.items);
        expect(result).to.contain('Jeff Pearce');
      });
    });
  });

  describe('get image', function() {
    it('should return image cover1.jpg', function() {
      //GIVEN
      var ip = '1.2.3.4';
      var port = 4444;
      var sonosApi = new SonosApi(logger, ip, port);
      var action = optionparser('/img/cover1.jpg');

      //WHEN
      sonosApi.handleAction(action, function(res, reply) {

        //THEN
        expect(reply.length).to.be.at.least(1000);
      });
    });
  });
});