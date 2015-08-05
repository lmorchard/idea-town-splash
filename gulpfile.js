var gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  cache = require('gulp-cache'),
  committers = require('gulp-git-committers'),
  concat = require('gulp-concat'),
  data = require('gulp-data'),
  imagemin = require('gulp-imagemin'),
  jade = require('gulp-jade'),
  eslint = require('gulp-eslint'),
  livereload = require('gulp-livereload'),
  minifycss = require('gulp-minify-css'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  vfs = require('vinyl-fs');

var del = require('del');

var runSequence = require('run-sequence');

// Lint the gulpfile
gulp.task('selfie', function(){
  return gulp.src('gulpfile.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('prep-config', function() {
  return vfs.src(['./.ebextensions/environment.config-dist'])
    .pipe(rename('environment.config'))
    .pipe(vfs.dest('./.ebextensions/', {overwrite: false}));
});

// Lint the *.js files
gulp.task('lint', function() {
  return gulp.src(['*.js', 'routes/*.js', 'src/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('authors', function () {
  return committers({email: true})
    .pipe(gulp.dest('./AUTHORS'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Styles
gulp.task('styles', function () {
  return gulp.src('src/styles/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('public/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('public/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('npm:tabzilla:img', function() {
  return gulp.src('node_modules/mozilla-tabzilla/media/**')
    .pipe(gulp.dest('public/vendor/mozilla-tabzilla/media'));
});

gulp.task('npm:tabzilla:css', function() {
  return gulp.src('./node_modules/mozilla-tabzilla/css/tabzilla.css')
    .pipe(rename('mozilla-tabzilla/css/tabzilla.scss'))
    .pipe(gulp.dest('src/vendor'));
});

gulp.task('npm:normalize', function() {
  return gulp.src('./node_modules/normalize.css/normalize.css')
    .pipe(rename('normalize.css/normalize.scss'))
    .pipe(gulp.dest('src/vendor'));
});

gulp.task('static-splash', function() {
  return gulp.src('views/index.jade')
    .pipe(data(function(){
      return require('./routes/data.json');
    }))
    .pipe(jade())
    .pipe(gulp.dest('public'));
});

gulp.task('clean', function (done) {
  del([
    'public',
    'src/vendor'
  ], done);
});

gulp.task('vendor', function (done) {
  return runSequence([
    'npm:tabzilla:img',
    'npm:tabzilla:css',
    'npm:normalize'
  ], done);
});

gulp.task('build', function (done) {
  runSequence(
    'clean',
    'vendor',
    'scripts',
    'styles',
    'images',
    'prep-config',
    done
  );
});

// Watches the things
gulp.task('default', function() {
  gulp.watch('src/styles/**/*', ['styles']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/scripts/**/*', ['scripts']);
  gulp.watch('gulpfile.js', ['selfie']);
  gulp.watch(['public/**', 'views/**']).on('change', livereload.changed);

  livereload({ start: true });
  livereload.listen();
});
