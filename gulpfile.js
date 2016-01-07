var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var del = require('del');
var rigger = require('gulp-rigger');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var path = {
    build: {
        html:   'build/',
        js:     'build/js/',
        css:    'build/css/',
        img:    'build/img/',
        fonts:  'build/fonts/'
    },
    src: {
        tpl:    'dev/pages/*.html',
        html:   'dev/',
        js:     'dev/js/main.js',
        css:    'dev/css/',
        scss:   'dev/scss/main.scss',
        img:    'dev/img/**/*.*',
        fonts:  'dev/fonts/**/*.*'
    },
    watch: {
        pages:  'dev/pages/*.html',
        parts:  'dev/partials/*.html',
        js:     'dev/js/**/*.js',
        scss:   'dev/scss/**/*.scss',
        img:    'dev/img/**/*.*',
        fonts:  'dev/fonts/**/*.*'
    },
    clean: './build'
};

//develop
gulp.task('devserver', function () {
    browserSync.init({
        server: "./dev"
    });

    gulp.watch(path.watch.scss, ['scss']);
    gulp.watch(path.watch.pages, ['html']);
    gulp.watch(path.watch.parts, ['html']);
});

gulp.task('html', function () {
    return gulp.src(path.src.tpl)
        .pipe(rigger())
        .pipe(gulp.dest(path.src.html))
        .pipe(browserSync.stream());
});

gulp.task('scss', function(){
    return gulp.src(path.src.scss)
        .pipe(sass())
        .pipe(prefixer())
        .pipe(gulp.dest(path.src.css))
        .pipe(browserSync.stream());
});

//build
gulp.task('clean:build', function () {
    return del(path.clean);
});

gulp.task('html:build', function () {
    return gulp.src(path.src.tpl)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', ['scss'], function () {
    gulp.src(path.src.css+'*.*')
        .pipe(cssnano())
        .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('buildserver', ['build'], function () {
    browserSync.init({
        server: "./build"
    });
});