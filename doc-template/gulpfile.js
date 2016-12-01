var src = ''
var dest = 'assets'
var theme = 'github'

var gulp = require('gulp')
var postcss = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var sass = require('gulp-sass')
var concat = require('gulp-concat')

gulp.task('style', function (done) {
  var processors = [
    autoprefixer({browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']})
  ]
  return gulp.src(src + 'style/chewingum.scss')
    .pipe(sass({
      sourceComments: true
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(gulp.dest(dest))
})

gulp.task('javascript', function (done) {
  return gulp.src(src + 'themes/' + theme + '/components/**/*.js')
    .pipe(concat('chewingum.js'))
    .pipe(gulp.dest(dest))
})

gulp.task('default', ['style', 'javascript'])
