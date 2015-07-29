var gulp = require('gulp'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    data = require('gulp-data'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    minifycss = require('gulp-minify-css'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass');
var mainBowerFiles = require('main-bower-files');
var runSequence = require('run-sequence');

// Lint the gulpfile
gulp.task('selfie', function(){
  return gulp.src('gulpfile.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Lint the *.js files
gulp.task('lint', function() {
  return gulp.src(['*.js', 'app/**/*.js', 'src/scripts/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('public/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Styles
gulp.task('styles', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
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

// Gets Bowered things move them to public/vendor
gulp.task('bower', function() {
  return gulp.src(mainBowerFiles(), { base: 'components' })
    .pipe(gulp.dest('public/vendor'))
    .pipe(notify({ message: 'Vendor libs ready' }));
});

gulp.task('bower:tabzilla', function() {
  return gulp.src('components/mozilla-tabzilla/media/**')
    .pipe(gulp.dest('public/vendor/mozilla-tabzilla/css/media'));
});

gulp.task('static-splash', function() {
  return gulp.src('app/views/index.html')
    .pipe(data(function(){
      return require('./app/data/pages/index.js');
    }))
    .pipe(jade())
    .pipe(gulp.dest('public'));

});

gulp.task('init', function() {
  runSequence(
    'scripts',
    'styles',
    'images',
    'bower',
    'bower:tabzilla',
    function(error) {
      if (error) {
        console.log('shit\'s broke son: ' + error.message);
      }
  });
});

// Watches the things
gulp.task('default', function() {

  gulp.watch('src/styles/**/*', ['styles']);
  gulp.watch('src/images/**/*', ['images']);
  gulp.watch('src/scripts/**/*', ['scripts']);
  gulp.watch('gulpfile.js',['selfie']);
  gulp.watch(['public/**','app/views/**']).on('change', livereload.changed);

  livereload({ start: true });
  livereload.listen();
});
