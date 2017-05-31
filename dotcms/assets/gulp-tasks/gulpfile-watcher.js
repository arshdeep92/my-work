var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sync = $.sync(gulp).sync;
var config = require('./gulpfile-configuration');
var utils = require('./gulpfile-utils');
var gulpAssets = require('./gulpfile-assets');
var gulpScripts = require('./gulpfile-scripts');
var gulpStyles = require('./gulpfile-styles');
var path = require('path');

module.exports = {
    gulpWatch: gulpWatch
};

function gulpWatch() {
    config.watcherIsRunning = true;
    $.livereload.listen();

    gulp.watch(gulpScripts.jsFilesToWatch, function (a) {
        console.log('Script changed: ' + a.path);
        return gulpScripts.runForChangedFileAndSync(a.path);
    });
    gulp.watch(gulpStyles.styleFilesToWatch, function (a) {
        console.log('Style changed: ' + a.path);
        return gulpStyles.runForChangedFileAndSync(a.path);
    });

    gulp.watch(gulpAssets.assetFilesToWatch, function (a) {
        console.log('Asset changed: ' + a.path);
        return gulpAssets.runForChangedFileAndSync(a.path);
    });
}