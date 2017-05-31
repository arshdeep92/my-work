var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var config = require('./gulpfile-configuration');
var webdav = require('./gulpfile-webdav');
var utils = require('./gulpfile-utils');
var path = require('path');
var webdavsync = require( 'gulp-webdav-sync' );
var es = require('event-stream');
var glob = require('glob-all');

var jsFiles = glob.sync([
        config.SOURCE_APP_DIR + '**/main.js'
]);
jsFiles = utils.filterPathsByConfiguredSite(jsFiles);

var jsFilesToWatch = [
        config.SOURCE_APP_DIR + '**/*.js'
];
jsFilesToWatch = utils.filterPathsByConfiguredSite(jsFilesToWatch);

var syncFiles = [
    config.BUILD_APP_DIR + '**/*.js'
];
syncFiles = utils.filterPathsByConfiguredSite(syncFiles);

module.exports = {
    initGulpTasks: initGulpTasks,
    jsFilesToWatch: jsFilesToWatch,
    runForChangedFileAndSync: runForChangedFileAndSync
};

var bundlers = jsFiles.map(function(jsFile) {
    return {
        w: null,
        init: function () {
            this.w = browserify({
                entries: jsFile,
                insertGlobals: false,
                cache: {},
                packageCache: {},
                debug: true
            });
        },
        bundle: function (suppressErrors) {
            var destDir = path.dirname(config.BUILD_APP_DIR + path.relative(config.SOURCE_APP_DIR, jsFile));
            var ret = this.w && this.w.bundle();

            if (suppressErrors) {
                ret = ret.on('error', plugins.util.log.bind(plugins.util, 'Browserify Error'))
            }

            return ret.pipe(source(utils.getFileNameWithoutPath(jsFile)))
                .pipe(gulp.dest(destDir));
        },
        filePath: jsFile
    };
});

function initGulpTasks() {
    gulp.task('scripts', function() {
        return bundlers.map(function(bundler) {
            bundler.init(false);
            return bundler.bundle();
        });
    });

    gulp.task('minify:scripts', function() {
        return gulp.src(config.BUILD_APP_DIR + '**/*.js', { base: config.BUILD_APP_DIR })
            .pipe(plugins.uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(config.BUILD_APP_DIR))
            .pipe(plugins.size());
    });

    gulp.task('send-everything:scripts', function() {
      return webdav.syncExistingFiles(syncFiles);
    });
}

//Called by the watcher
function runForChangedFileAndSync(filePath) {
    var theseBundlers = bundlers;

    return theseBundlers.map(function(bundler) {
        bundler.init(false);
        return es.pipeline(
            bundler.bundle(true)
            , es.through(function write(data) {
                    this.emit('data', data);
                }
                , function end() {
                    for (var site of config.DISTINCT_SITES) {
                        gulp.src(config.BUILD_APP_DIR + path.relative(config.SOURCE_APP_DIR, bundler.filePath))
                            .pipe(webdavsync(webdav.getWebdavOptions(site)))
                            .pipe(plugins.livereload());
                    }
                    this.emit('end');
                })
        );
    });
}
