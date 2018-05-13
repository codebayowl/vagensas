var gulp            = require('gulp'), 							// Их величество Gulp собственной персоной
    sass            = require('gulp-sass'),					// препроцессор Sass (включая синтаксис SCSS) для Gulp
    browserSync     = require('browser-sync'),			// обновлялка браузера
    concat          = require('gulp-concat'),				// конкатенация файлов
    uglify          = require('gulp-uglify'),				// сжатие JS
    cssnano         = require('gulp-cssnano'),			// сжатие CSS
    rename          = require('gulp-rename'),				// переименование файлов (для суффиксов всяческих и тд)
    del             = require('del'),								// удаление файлов и папок (для билда - предварительная очистка всего билд-каталога)
    imagemin        = require('gulp-imagemin'),			// работа с изображениями
    pngquant        = require('imagemin-pngquant'),	// работа с png
    cache           = require('gulp-cache'),				// работа с кешированием
    autoprefixer    = require('gulp-autoprefixer'),	// автопрефиксер
    pug             = require('gulp-pug');					// препроцессор pug



// КОМПИЛЯЦИЯ Sass/SCSS
gulp.task('styles', function() {
    return gulp.src([
			'sources/styles/*.+(scss|sass)',																										// берем все файлы с расширением .scss и .sass в папках с аналогичными расширению названиями, ...
			'!sources/**/_*.*' 																																	// ... КРОМЕ файлов, начинающихся с нижнего подчёркивания
		])
    .pipe(sass()) 																																				// Преобразуем Sass в CSS посредством gulp-sass
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))	// Создаем префиксы
    .pipe(gulp.dest('sources/css')) 																											// Выгружаем результата в папку sources/css
    .pipe(browserSync.reload({stream: true})) 																						// Обновляем CSS на странице при изменении
});



// СЖАТИЕ CSS БИБЛИОТЕК

/////////////////////////////////////////////////////
//																								 //
//  !!! ВЫНЕСТИ СПИСОК БИБЛИОТЕК В ПЕРЕМЕННУЮ !!!  //
//																								 //
/////////////////////////////////////////////////////

gulp.task('css-libs', ['styles'], function() {
    return gulp.src([
			'sources/assets/libraries/normalize.css/normalize.css',	// берём библиотеки (подключаем вручную, построчно)
			'sources/assets/modules/**/*.css',											// далее берём все css в папке с модулями, ...
			'!sources/**/_*.*'																			// ... НО бэз андерскоров в начале имени
		])
		.pipe(concat('libs.min.css')) 														// конкатенируем всю эту радость в файл libs.min.css
		.pipe(cssnano()) 																					// Сжимаем его
		.pipe(gulp.dest('sources/css')); 													// и выгружаем в папку sources/css
});

// КОМПИЛЯЦИЯ PUG
gulp.task('pages', function() {
		return gulp.src([
			'sources/pages/*.pug',				// берём в папке с сырцами все pug, НО ...
			'!sources/pages/_*.*'					// ... исключаем из них все, начинающиеся на андерскор
		])
		.pipe(pug())									// компилируем их
		.pipe(gulp.dest('sources'))		// и выгружаем каждый в отдельности в корень папки с сырцами
});



// ПЕРЕЖАТИЕ БИБЛИОТЕК JS

/////////////////////////////////////////////////////
//																								 //
//  !!! ВЫНЕСТИ СПИСОК БИБЛИОТЕК В ПЕРЕМЕННУЮ !!!  //
//																								 //
/////////////////////////////////////////////////////

gulp.task('scripts', function() {
    return gulp.src([ 																			// Берем все необходимые библиотеки:
			'sources/assets/libraries/jquery/dist/jquery.min.js'	//  - jQuery,
		])
		.pipe(concat('libs.min.js')) 														// Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify())																					// Сжимаем этот файл
		.pipe(gulp.dest('sources/js'));													// Выгружаем его в папку sources/js
});



// СИНХРОНИЗАЦИЯ БРАУЗЕРА
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'sources'	// исходная папка, откуда "слушаются" файлики
        },
        notify: false
    });
});


// ШПИЁН
gulp.task('watch', ['browser-sync', 'css-libs', 'pages', 'scripts'], function() {	// Перед запуском Вотча запустить сервер окна браузера, скомпайлить цсс с пагом, пережать библиотеки
	gulp.watch('sources/styles/*.+(sass|scss)', ['styles']); 												// watch sass/scss files
	gulp.watch('sources/pages/*.pug', ['pages']);																		// watch pug files
	gulp.watch('sources/*.html', browserSync.reload);																// watch HTML files
	gulp.watch('sources/js/**/*.js', browserSync.reload);														// watch JS files
});

// ПРОДАКШН:
// clear
gulp.task('clean', function() {
	return del.sync('public');					// Удаляем папку public перед сборкой
});
// imgs
gulp.task('img', function() {
	return gulp.src('sources/img/**/*') // Берем все изображения из sources
		.pipe(cache(imagemin({  					// Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('public/img')); 	// Выгружаем на продакшен
});
	
// build
gulp.task('build', ['clean', 'img', 'styles', 'pages', 'scripts'], function() {
 
    var buildCss = gulp.src([ 									// Переносим библиотеки в продакшн
			'sources/css/libs.min.css',
			'sources/css/styles.css'
		])
		.pipe(concat('styles.css'))
    .pipe(gulp.dest('public/css'));
 
    var buildJs = gulp.src([ 
			'sources/js/libs.min.js', 								// берём минимизированные библиотеки,
			'sources/js/styles.js' 										// и наш несжатый скрипт для сайта
		])
		.pipe(concat('styles.js')) 									// сливаем их в один файл
    .pipe(gulp.dest('public/js')); 							// и выгружаем в продакшн
 
    var buildHtml = gulp.src('sources/*.html')	// Переносим HTML в продакшн
    .pipe(gulp.dest('public'));
 
});
	
// очистка кэша
gulp.task('clear', function () {
    return cache.clearAll();
});
	
// задаём для gulp таск по-умолчанию
gulp.task('default', ['watch']);