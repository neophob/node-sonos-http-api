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
      test: 'test'
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
      all: [
        'Gruntfile.js',
        '<%= conf.app %>/server.js',
        '<%= conf.app %>/conf/*.js',
        '<%= conf.app %>/lib/*.js',
        '<%= conf.app %>/notification/*.js',
        '<%= conf.app %>/rest/**/*.js',
        '<%= conf.app %>/sonos/*.js',
        '<%= conf.test %>/*.js',
        '<%= conf.test %>/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      //run all tests on cli (integration and unit tests)
      //used to: run all tests local (needs postgres)
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['<%= conf.test %>/integration/*/*.js',
              '<%= conf.test %>/unit/*/*.js'
             ]
      },
      //run only unit tests (no need for an external db)
      //used to: run all tests on jenkins (does not need a postgres db)
      ci: {
        src: ['<%= conf.test %>/unit/*/*.js'
        ],
        options: {
          reporter: 'xunit',
          captureFile: '<%= conf.testtarget %>/test-results.xml'
        }
      },
      //run all tests (integration and unit tests), no cli output but create a testrunner xml file for jenkins
      //used to: run all tests on the dui server (needs postgres)
      cd: {
        src: ['<%= conf.test %>/integration/**/*.js',
              '<%= conf.test %>/unit/**/*.js'
             ],
        options: {
          reporter: 'xunit',
          captureFile: '<%= conf.testtarget %>/test-results.xml'
        }
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
      },
      test: {
        src: ['<%= conf.testtarget %>/*']
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
            'assets/**',
            'server.js'
          ]
        }, {
          expand: true,
          dot: false,
          cwd: './',
          dest: '<%= conf.dist %>',
          src: [
            'package.json'
          ]
        }]
      }
    }

  });

  grunt.registerTask('test', ['clean:test', 'env:test', 'jshint', 'mochaTest:test']);
  grunt.registerTask('build', ['clean:dist', 'copy:dist']);

  grunt.registerTask('default', ['test', 'build']);

};
