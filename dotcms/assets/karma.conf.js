/**
 * Created by smccullough on 2016-07-06.
 */

var gulpConfig = require('./gulp-tasks/gulpfile-configuration.js');

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],

    frameworks: ['browserify','jasmine'],

    files: [
      'src/main/resources/application/js/**/*.js',
      'src/main/resources/application/js/*.js',
      'src/test/resources/application/js/**/*.spec.js'
    ],

    preprocessors: {
      'src/main/resources/application/js/**/*.js': ['browserify','coverage'],
      'src/test/resources/application/js/modules/*.js': ['browserify'],
    },

    reporters: ['progress','coverage'],

    colors: true,

    logLevel: config.LOG_DEBUG,

    autoWatch: false,

    browserify: {
      debug: true,
      // needed to enable mocks
      plugin: [require('proxyquireify').plugin]
    },

    coverageReporter: {
      type : 'html',
      dir : gulpConfig.TEST_APP_DIR + 'js/coverage/'
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-browserify',
      'karma-coverage'
    ],

    singleRun: true
  });
};
