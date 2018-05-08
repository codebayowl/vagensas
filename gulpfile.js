var gulp            = require('gulp'), // сам Галп
    sass            = require('gulp-sass'), // Sass/SCSS для галпа
    browserSync     = require('browser-sync'), // обновлялка браузера
    concat          = require('gulp-concat'), // конкатенация файлов
    uglify          = require('gulp-uglify'), // сжатие JS
    cssnano         = require('gulp-cssnano'), // минификации CSS
    rename          = require('gulp-rename'), // переименование файлов CSS
    del             = require('del'), //удаление файлов и папок
    imagemin        = require('gulp-imagemin'), // работа с изображениями
    pngquant        = require('imagemin-pngquant'), // работа с png
    cache           = require('gulp-cache'), // кеширование
    autoprefixer    = require('gulp-autoprefixer'), // автопрефиксер
    pug             = require('gulp-pug'); //препроцессор pug

// СБОРКА SASS/SCSS
gulp.task('sass', function() {
    return gulp.src('sources/scss/styles.scss') // Берем источник
    .pipe(sass()) //Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
    .pipe(gulp.dest('sources/css')) // Выгружаем результата в папку src/css
    .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// СЖАТИЕ CSS БИБЛИОТЕК
gulp.task('css-libs', ['sass'], function() {
    return gulp.src([
			'sources/assets/libraries/normalize.css/normalize.css',
			'sources/assets/modules/*.css'
		])
		.pipe(concat('libs.min.css')) //конкатенируем
		.pipe(cssnano()) // Сжимаем
		.pipe(gulp.dest('sources/css')); // Выгружаем в папку app/css
});

// СБОРКА PUG
gulp.task('pug', function() {
		return gulp.src([
			'sources/pug/*.pug',
			'!sources/pug/_*.*'
		])
		.pipe(pug())
		.pipe(gulp.dest('sources'))
});

// ПЕРЕЖАТИЕ БИБЛИОТЕК JS
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
			'sources/assets/libraries/jquery/dist/jquery.min.js' // Берем jQuery
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('sources/js')); // Выгружаем в папку app/js
});

// СИНХРОНИЗАЦИЯ БРАУЗЕРА
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'sources'
        },
        notify: false
    });
});


// ШПИЁН
gulp.task('watch', ['browser-sync', 'css-libs', 'pug', 'scripts'], function() {
	gulp.watch('sources/scss/*.scss', ['sass']); //watch sass files
	gulp.watch('sources/pug/*.pug', ['pug']); //watch pug files
	gulp.watch('sources/*.html', browserSync.reload); // watch HTML files
	gulp.watch('sources/js/**/*.js', browserSync.reload); // watch JS files
});

// ПРОДАКШН
gulp.task('clean', function() {
	return del.sync('public'); // Удаляем папку public перед сборкой
});
 
gulp.task('img', function() {
	return gulp.src('sources/img/**/*') // Берем все изображения из sources
		.pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('public/img')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'sass', 'pug', 'scripts'], function() {
 
    var buildCss = gulp.src([ // Переносим библиотеки в продакшн
			'sources/css/styles.css',
			'sources/css/libs.min.css'
		])
    .pipe(gulp.dest('public/css'))
 
    var buildJs = gulp.src([ 
			'sources/js/libs.min.js', // берём минимизированные библиотеки,
			'sources/js/styles.js' // и наш несжатый скрипт для сайта
		])
		.pipe(concat('styles.js')) // сливаем их в один файл
    .pipe(gulp.dest('public/js')); // и выгружаем в продакшн
 
    var buildHtml = gulp.src('sources/*.html') // Переносим HTML в продакшн
    .pipe(gulp.dest('public'));
 
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);