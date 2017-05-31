var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./gulpfile-configuration');
var webdav = require('./gulpfile-webdav');
var utils = require('./gulpfile-utils');
var path = require('path');
var webdavsync = require( 'gulp-webdav-sync' );
var debug = require('gulp-debug');

var assetFiles = [
  config.SOURCE_APP_DIR + '**/*',
  '!' + config.SOURCE_APP_DIR + '**/*.scss',
  '!' + config.SOURCE_APP_DIR + '**/*.js',
  '!' + config.SOURCE_APP_DIR + '**/*.less'
];

assetFiles = utils.filterPathsByConfiguredSite(assetFiles);

// files to be synced with *-everything
var syncFiles = [
    config.BUILD_APP_DIR + '**/*'
];
syncFiles = utils.filterPathsByConfiguredSite(syncFiles);


module.exports = {
    initGulpTasks: initGulpTasks,
    assetFilesToWatch: assetFiles,
    runForChangedFileAndSync: runForChangedFileAndSync
};

function initGulpTasks() {
    gulp.task('assets', function() {
        return gulp.src( assetFiles, {base: config.SOURCE_DIR, nodir: true})
            .pipe(plugins.changed(config.BUILD_DIR))
            .pipe(gulp.dest(config.BUILD_DIR));
    });

    gulp.task('send-everything:assets', function() {
      return webdav.syncExistingFiles(syncFiles);
    });
}


//Called by the watcher
function runForChangedFileAndSync(filePath) {
    for (var site of config.DISTINCT_SITES) {
        gulp.src(filePath, {base: config.SOURCE_APP_DIR})
            .pipe(gulp.dest(config.BUILD_APP_DIR))
            .pipe(webdavsync(webdav.getWebdavOptions(site)))
            .pipe(plugins.livereload());
    }
}



