// include gulp
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    gulp_open = require('gulp-open'),
    jasmine = require('gulp-jasmine');
//livereload = require('gulp-livereload');

// include plug-ins
// makes browser do a full-page refresh when change is made on static files (.js,.scss,.html)
var browserSync = require("browser-sync").create();

gulp.task("default", ['watch', 'jshint']);
// run tests
gulp.task('test', function() {
    gulp.src("./jasmine/spec/inverted-index-test.js")
        .pipe(jasmine());
});
// open the .html file on the default browser
gulp.task('jasBrowse', function() {
    gulp.src("./jasmine/SpecRunner.html").pipe(gulp_open());
});
//reload the jasmine broswer whenevr the spec files are changed
gulp.task('watch', function() {
    gulp.watch('./jasmine/spec/*.js', browserSync.reload);
    //livereload.listen();
});

// JShint task
gulp.task('jshint', function() {
    gulp.src('./jasmine/spec/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint'));
});