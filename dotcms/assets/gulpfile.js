/**
 * Known issues:
 * - Livereload with scripts gets called too early when compiling multiple async scripts
 * - EShint would be nice
 * - Curl command writes too much garbage text to the console. Using -o /dev/null -w "%{http_code}" mostly fixes this, but sometimes throws errors.
 */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var sync = $.sync(gulp).sync;
var del = require('del');

var config = require('./gulp-tasks/gulpfile-configuration');
var gulpScripts = require('./gulp-tasks/gulpfile-scripts');
var gulpStyles = require('./gulp-tasks/gulpfile-styles');
var gulpAssets = require('./gulp-tasks/gulpfile-assets');
var gulpWatcher = require('./gulp-tasks/gulpfile-watcher');
var gulpWebdav = require('./gulp-tasks/gulpfile-webdav');
var gulptest = require('./gulp-tasks/gulpfile-tests');

gulpStyles.initGulpTasks();
gulpScripts.initGulpTasks();
gulpAssets.initGulpTasks();
gulptest.initGulpTasks();

gulp.task('set-production', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('test', ['tests']);
gulp.task('minify', ['minify:scripts', 'minify:styles']);
gulp.task('send-everything', ['send-everything:scripts', 'send-everything:styles', 'send-everything:assets']);
gulp.task('bundle', ['styles', 'scripts', 'assets']);
gulp.task('clean-bundle', sync(['clean', 'bundle']));
gulp.task('send', gulpWebdav.syncExistingFilesOnAllSites);


//Final tasks
//Also include --site="loyalty.com" or --site="precima.com" to limit watching and compiling to a specific site
//You can also use --webdavconfigtype=?, where ? is the config type in the webdav-sync.properties file. "dev" is the default value
gulp.task('clean', del.bind(null, config.BUILD_DIR));
gulp.task('watch', gulpWatcher.gulpWatch);
gulp.task('build', sync(['clean-bundle', 'minify']));
gulp.task('build-send', sync(['test', 'build', 'send']));
gulp.task('build-send-watch', sync(['build', 'send', 'watch']));
gulp.task('bundle-send-watch', sync(['bundle', 'send', 'watch']));
gulp.task('build-send-everything', sync(['test', 'build', 'send-everything']));
gulp.task('build-send-everything-watch', sync(['build', 'send-everything', 'watch']));
gulp.task('build:production', sync(['set-production', 'test', 'build', 'minify']));
gulp.task('build-send:production', sync(['set-production', 'test', 'build', 'minify', 'send']));
gulp.task('default', ['build']);

