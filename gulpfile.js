const gulp = require('gulp');
const jasmine = require('gulp-jasmine');
const livereload = require('gulp-livereload');
const browserSync = require('browser-sync').create();

// run tests
gulp.task('test', () => {
  gulp.src('./jasmine/spec/inverted-index-test.js')
        .pipe(jasmine());
});
gulp.task('browser', () => {
  browserSync.init({
    server: {
      baseDir: './src',
    },
    port: 2700,
    ui: {
      port: 2700,
    },
  });
  gulp.watch('./src/**/*.{html,css,js}').on('change', browserSync.reload);
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.{html,css,js}').on('change', browserSync.reload);
  livereload.listen();
});

gulp.task('default', ['watch', 'test', 'browser']);
