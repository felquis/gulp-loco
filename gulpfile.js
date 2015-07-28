var gulp = require('gulp');

/**
 * CSS Modules
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
 * Build dos arquivos relacionados ao Ionic
 */
gulp.task('ionic-styles', function () {
	var mainModule = gulp.src(['src/variables/ionic.scss']);

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
 * Cria os estilos dos states do app
 */
gulp.task('styles', function() {
	var mainModule = gulp.src(['src/variables/variables.scss']);
	var otherModules = gulp.src(['src/{,*/,*/*/}*.scss', '!src/variables/**'])
	var merged = mergeStream(mainModule, otherModules);

  return merged
  	.pipe(sourcemaps.init())
  	.pipe(concat('css/app.css'))
  	.pipe(plumber())
  	.pipe(sass({outputStyle: 'expanded'}))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist'))
    .pipe(sourcemaps.write('./'))
    .pipe(minifycss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(notify({ message: 'Styles task complete' }));
});

/**
 * Serve o app no browser
 */
var browserSync = require('browser-sync').create('gulp');

gulp.task('browser', ['ionic-styles', 'styles'], function() {
	browserSync.init({
      server: {
      	// Estes são os arquivos do server, usamos o `dist`
      	// para carregar alguns arquivos que já foram processados
		    baseDir: ['./src', './dist']
			}
  });

	// Se qualquer estilo scss for alterado, refaz a task `styles`
  gulp.watch(['src/{,*/,*/*/}*.scss', '!src/variables/**'], ['styles']);
  // Se o arquivo do `ionic` for alterado, refaz o `ionic-style` (também ativará a tarefa acima)
  gulp.watch('src/variables/ionic.scss', ['ionic-styles']);
  // Se algum arquivo HTML for alterado, atualiza!
  gulp.watch('src/{,*/}*.html').on('change', browserSync.reload);
})
