var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var path = require('path');
var strip = require('gulp-strip-comments');
const babel = require('gulp-babel');

var paths = {
  scripts: [
      'bower_components/jquery/dist/jquery.js',
      'public/scripts/**/dist/*.min.js',
      'public/scripts/vendor/*.js',
      'public/scripts/utilities/*.js',
      'public/scripts/*.js'
  ],
  images: [
      'public/images/**/*.png', 
      'public/images/**/*.jpg'
  ],
  css: [
      '!public/styles/*.less',
      'public/styles/vendor/*.css',
      'public/styles/*.css'
  ],
  less: [
      'public/styles/site.less'      
  ],
  fonts: [
      'public/fonts/*.eot',
      'public/fonts/*.ttf',
      'public/fonts/*.woff',
      'public/fonts/*.svg',
      'public/fonts/*.woff2',
  ]
};

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src` 
  return del(['build/css', 'build/js']);
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(concat('less.css'))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('css', ['less'], function(){
  return gulp.src(paths.css)
    .pipe(concat('all.css'))
    //.pipe(minifyCSS())
    .pipe(gulp.dest(__dirname + '/build/css'))
});

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts) 
  // with sourcemaps all the way down 
  return gulp.src(paths.scripts)
    .pipe(babel({
            presets: ['es2015']
        }))
    .pipe(strip())
    .pipe(sourcemaps.init())
      //.pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(__dirname + '/build/js'));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task 
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(__dirname + '/build/img'));
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    // Pass in options to the task 
    .pipe(gulp.dest(__dirname + '/build/fonts'));
});
 
// Rerun the task when a file changes 
gulp.task('watch', ['clean', 'css', 'scripts'], function() {
    
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.css, ['css']);
  gulp.watch("public/styles/*.less", ['less']);
  gulp.start('watch');
});
 
// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['clean', 'css', 'scripts', 'images', 'fonts']);