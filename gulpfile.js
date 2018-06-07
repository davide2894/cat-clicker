const gulp = require('gulp'),
	browserSync = require('browser-sync'),
	useref = require('gulp-useref'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify-es').default,
	pump = require('pump'),
	gulpIf = require('gulp-if'),
	cssnano = require('gulp-cssnano'),
	cleanCSS = require('gulp-clean-css'),
	image = require("gulp-image"),
	imagemin = require('gulp-imagemin'),
	imageminPngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	del = require('del'),
	runSequence = require('run-sequence'),
	autoprefixer = require('gulp-autoprefixer'),
	eslint = require('gulp-eslint'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	lazypipe = require('lazypipe');


// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	})
})

// Copy index.html into docs/
gulp.task('html', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('docs'))
})

// Sass task goes here

// eslint
gulp.task('lint', () => {
	// ESLint ignores files with "node_modules" paths.
	// So, it's best to have gulp ignore the directory as well.
	// Also, Be sure to return the stream from the task;
	// Otherwise, the task may end before the stream has finished.
	return gulp.src(['config.paths.js'])
		// eslint() attaches the lint output to the "eslint" property
		// of the file object so it can be used by other modules.
		.pipe(eslint())
		// eslint.format() outputs the lint results to the console.
		// Alternatively use eslint.formatEach() (see Docs).
		.pipe(eslint.format())
		// To have the process exit with an error code (1) on
		// lint error, return the stream and pipe to failAfterError last.
		.pipe(eslint.failAfterError());
});


// Watchers
gulp.task('watch', function () {
	gulp.watch('src/css/**/styles.css', browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
})

// Responsive images
gulp.task("images:responsive", function () {
	return gulp.src(["src/images/*.{png,jpg}"])
		.pipe($.responsive({
			// resize all JPGs to different resolutions
			"*.jpg": [{
					width: 300,
					rename: {
						suffix: "-300px"
					},
            },
				{
					width: 500,
					rename: {
						suffix: "-500px"
					},
            },
				{
					width: 650,
					rename: {
						suffix: "-650px"
					},
            },
				{
					// compress, strip metadata and rename original image
					rename: {
						suffix: "-original"
					},
            }
        ],
			// resize all PNG to be retina ready
			"*.png": [
				{
					width: 250,
            },
				{
					width: 250 * 2,
					rename: {
						suffix: "@2x"
					},
            }
        ],
		}, {
			// Global configuration for all images
			// The output quality for JPEG, Webp and TIFF output formats
			quality: 70,
			// Use progressive (interlace) scan for JPEG and PNG output
			progressive: true,
			// Strip all metadata
			widthMetadata: false,
		}))
		.pipe(gulp.dest("src/images/responsive"));
});

// Optimization Tasks 
// ------------------

// Concatenate and minify JS files
gulp.task('scripts', function (cb) {
	// Pump prints human-friendly errors to the console
	pump([
		gulp.src('src/js/**/*.js'),
		sourcemaps.init(),
		concat('all.js'), // Concatenate js files
		uglify(), // Minify all.js
		sourcemaps.write('.'), // Write sourcemap file in same dest folder
		gulp.dest('docs/js')
		], cb);
})

gulp.task('useref', function(){
	return gulp.src('src/index.html')
		.pipe(sourcemaps.init())
		.pipe(useref({}, lazypipe().pipe(sourcemaps.init, {loadMaps: true})))
		.pipe(gulpIf('*.css', cleanCSS({
			compatibility: 'ie8'
		})))		
		.pipe(gulpIf('*.js', uglify()))
		.pipe(sourcemaps.write('.')) // Write sourcemap file in same dest folder
		.pipe(gulp.dest('docs'));
})

// Minify CSS
gulp.task('styles', function () {
	return gulp.src('src/css/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(sourcemaps.write('.')) // Write sourcemap file in same dest folder
		.pipe(gulp.dest('docs/css'));
})

// Optimizing Images 
gulp.task('images', function () {
	return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			use: [imageminPngquant()]
		}))
		.pipe(gulp.dest('docs/images'))
});

// Compress Images
gulp.task("images:compress", function () {
	gulp.src("images/**/*.*")
		.pipe(image({
			jpegRecompress: ['--strip', '--quality', 'medium', '--min', 6, '--max', 8],
			jpegoptim: false,
			mozjpeg: false,
			concurrent: 10,
		}))
		.pipe(gulp.dest("images_src/compressed2"));
});

// Copying fonts 
gulp.task('fonts', function () {
	return gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('docs/fonts'))
})

// Cleaning 
gulp.task('clean', function () {
	return del.sync('docs');
});

// Build Sequences
// ---------------

// Build development version
gulp.task('default', function (callback) {
	runSequence(['lint', 'browserSync'], 'watch',
		callback
	)
});



// Build production version
//gulp.task('build', function (callback) {
//	runSequence('clean', ['html', 'styles', 'scripts', 'images', 'fonts'],
//		callback
//	)
//});
gulp.task('build', function (callback) {
	runSequence('clean', ['useref', 'images', 'fonts'],
		callback
	)
});
