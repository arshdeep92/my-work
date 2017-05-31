var gulp = require('gulp');
var karma = require('karma').server;
var config = require('./gulpfile-configuration');
var $ = require('gulp-load-plugins')();
var sync = $.sync(gulp).sync;


function initGulpTasks() {
    gulp.task('tests', function(done) {
        return karma.start({
            configFile: __dirname.replace(/gulp-tasks/g,'') + 'karma.conf.js',
            singleRun: true
        }, done);
    });
}

module.exports = {
    initGulpTasks: initGulpTasks
};
