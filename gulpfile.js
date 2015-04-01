var gulp = require('gulp');
var react = require('gulp-react');
var rimraf = require('gulp-rimraf');
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['src/**/*.jsx'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean-lib', function () {
  return gulp.src(['./lib/**/*.js'], {read: false}).pipe(rimraf());
});

gulp.task('jsx-compile', ['clean-lib'], function () {
  return gulp.src('src/**/*.jsx')
    .pipe(react({harmony: true}))
    .pipe(gulp.dest('./lib'));
});

gulp.task('watch', ['jsx-compile'], function () {
    gulp.watch('src/**/*.jsx', ['jsx-compile']);
});

gulp.task('default', ['watch']);
