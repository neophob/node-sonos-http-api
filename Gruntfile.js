'use strict';

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    conf: {
      // configurable paths
      app: 'app',
      dist: 'dist',
      test: 'test',
      assets: 'assets'
    },

    //env settings
    env: {
      dev: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug'
      },
      test: {
        NODE_ENV: 'test',
        LOG_LEVEL: 'debug'
      }
    },
    jshint: {
      //hint: the sonos implementation is not checked!
      all: [
        'Gruntfile.js',
        '<%= conf.app %>/conf/*.js',
        '<%= conf.app %>/lib/*.js',
        '<%= conf.app %>/notification/*.js',
        '<%= conf.app %>/rest/**/*.js',
        '<%= conf.app %>/virtual-sonos/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
              '<%= conf.test %>/unit/*.js'
             ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= conf.dist %>/*',
            '!<%= conf.dist %>/.git*',
            '!<%= conf.dist %>/Procfile'
          ]
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: false,
          cwd: '<%= conf.app %>',
          dest: '<%= conf.dist %>',
          src: [
            'conf/*.js',
            'lib/*.js',
            'notification/*.js',
            'rest/**/*.js',
            'sonos/*.js',
            'sonos-virtual/*.js',
            'server.js',
            'virtualserver.js'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: './',
          dest: '<%= conf.dist %>',
          src: [
            'package.json'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: '<%= conf.assets %>',
          dest: '<%= conf.dist %>/assets',
          src: [
            'img/*',
            'json/*'
          ]
        }]
      }
    }

  });

  grunt.registerTask('test', [ 'env:test', 'jshint', 'mochaTest:test']);
  grunt.registerTask('build', ['clean:dist', 'copy:dist']);

  grunt.registerTask('default', ['test', 'build']);

};
