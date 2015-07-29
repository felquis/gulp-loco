var gulp = require('gulp');
var runSequence = require('run-sequence');

/**
 * Tasks de CSS
 */
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var mergeStream = require('merge-stream');
var plumber = require('gulp-plumber');

/**
 * Cria o arquivo `css/ionic{.min}.css`
 */
gulp.task('ionic-styles', function () {
	var mainModule = gulp.src(['src/scss/ionic.scss']);

  return mainModule
  	.pipe(plumber())
  	.pipe(concat('css/ionic.css'))
  	.pipe(sourcemaps.init())
  	.pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Ionic styles task complete' }));
});

/**
 * Cria o arquivo `css/app{.min}.css`
 */
gulp.task('styles', function() {
  var mainModule = gulp.src(['src/scss/variables.scss']);
	var otherModules = gulp.src(['src/states/{,*/}*.scss']);
  var merged = mergeStream(mainModule, otherModules);

  return merged
    .pipe(plumber())
    .pipe(sourcemaps.init())
  	.pipe(concat('css/app.css'))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.write('./'))
    // .pipe(minifycss())
    // .pipe(rename({suffix: '.min'}))
    // .pipe(gulp.dest('dist'))
    // .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * Serve o app no browser
 */
var browserSync = require('browser-sync').create('gulp');

gulp.task('prepare', function(callback) {
  runSequence(['ionic-styles', 'styles'],
              ['javascript'],
              callback);
});

gulp.task('browser', ['prepare'], function() {
	browserSync.init({
      server: {
      	// Estes são os arquivos do server, usamos o `dist`
      	// para carregar alguns arquivos que já foram processados
		    baseDir: ['./src', './dist', './bower_components']
			}
  });

	// Se qualquer estilo scss for alterado, refaz a task `styles`
  gulp.watch(['src/{,*/,*/*/}*.scss', '!src/variables/**'], ['styles']);
  // Se o arquivo do `ionic` for alterado, refaz o `ionic-style` (também ativará a tarefa acima)
  gulp.watch('src/variables/ionic.scss', ['ionic-styles']);
  // Se algum arquivo HTML for alterado, atualiza!
  gulp.watch('src/{,*/}*.html').on('change', browserSync.reload);
  // Ao alterar algum arquivo de JavaScript
  gulp.watch(['src/{,*/,*/*/}*.js'], ['javascript']);
})

/**
 * Tasks de JavaScript
 */
var fs = require('fs');
var babel = require('gulp-babel');

gulp.task('javascript', function () {
	var options = {
		modules: 'umd'
	}

  return gulp.src('src/{,*/,*/*/}*.js')
  	.pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel(options))
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/scripts'));
});
