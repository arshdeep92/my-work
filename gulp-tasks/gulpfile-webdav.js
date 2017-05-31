var gulp = require('gulp');
var gulputil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var _ = require('lodash-compat');
var config = require('./gulpfile-configuration');
var utils = require('./gulpfile-utils');
var path = require('path');
var fs = require('fs');
var del = require('del');
var webdav = require('gulp-webdav-sync');
var debug = require('gulp-debug');
var es = require('event-stream');

var vmInfo = config.vmInfo;

module.exports = {
    syncExistingFilesOnAllSites: syncExistingFilesOnAllSites,
    getWebdavOptions: getWebdavOptions,
    syncExistingFiles: syncExistingFiles
};

gulp.task('clean-webdav', function() {
    var options = getWebdavOptions();
    options.clean = true;
    options.pathname = options.pathname + "application/";

    return webdav(options).clean();
});

function getWebdavOptions(site){
    if (_.isUndefined(site)) {
        site = config.SITES[0];
    }
  // Note: change the uselastmodified time if files are not being sent
    return {
        protocol: vmInfo.protocol + ":"
        , auth: vmInfo.username + ":" + vmInfo.password
        , hostname: vmInfo.host
        , port: vmInfo.port
        , pathname: vmInfo.pathname + site.name + '/'
        , log: 'log'
        , logAuth: true
        , base: config.BUILD_DIR
        , uselastmodified: 11000
    };
}

function syncExistingFilesOnAllSites() {
  var streams = [];

  for (var site of config.DISTINCT_SITES) {
      streams.push(syncExistingFiles([config.BUILD_APP_DIR + '**/*'], getWebdavOptions(site)));
    }

    return es.merge(streams);
}

function syncExistingFiles(filePaths, webDavOptions) {
  if (_.isUndefined(webDavOptions)) {
    webDavOptions = getWebdavOptions();
  }

  gulputil.log('Syncing files of patterns: ' + filePaths);
  return gulp.src(filePaths, {base: config.BUILD_APP_DIR})
    .on('error',gulputil.log)
    .pipe(debug())
    .on('error', gulputil.log)
    .pipe(webdav(webDavOptions))
    .on('end', ()=> {gulputil.log('Finished Syncing files')});
}
