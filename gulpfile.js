const gulp = require('gulp');
const babel = require('gulp-babel');
const lf = require('localforage');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const order = require("gulp-order");
const jshint = require('gulp-jshint');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');


gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'));
});

const jsFiles = {
    app: 'src/js/app.js',
    main: 'src/js/main/*.js',
    admin: 'src/js/admin/*.js'
};
const jsDest = 'js/min';

gulp.task('lint', function () {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/**
 * Setup global variables and options here
 * This should be called before any of our own JS files
 *
 * There should be NO logic in this file, it should only create variables/objects
 * and give you an idea of what is going to happen in the app
 */
gulp.task('app-script', function () {
    return gulp.src(jsFiles.app)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.compiled.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

/**
 * This is where all of the main processing of the JS happens
 */
gulp.task('main-script', function () {
    return gulp.src(jsFiles.main)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(order([
            'cookie.js',
            'localforage.js',
            'itinerary.js'
        ], {base: './src/js/main/'}))
        .pipe(concat('main.compiled.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

/**
 * For easy local storage functionality
 */
gulp.task('admin-script', function () {
    return gulp.src(jsFiles.admin)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('admin.compiled.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('admin.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});

/**
 * Start watchers on all the different script sets
 */
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch(jsFiles.app, ['app-script']);
    gulp.watch(jsFiles.main, ['main-script']);
    gulp.watch(jsFiles.admin, ['admin-script']);
});

/**
 * We first compile everything when we first call "gulp", and then we watch those files for changes
 */
gulp.task('default', ['app-script', 'main-script', 'admin-script', 'watch']);