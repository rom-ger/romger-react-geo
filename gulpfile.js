const gulp = require('gulp');
const gutil = require('gulp-util');
const tslint = require('gulp-tslint');
const eslint = require('gulp-eslint');
const del = require('del');
const babel = require('gulp-babel');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const ts = require('gulp-typescript');
const sassGlob = require('gulp-sass-glob');
const lazyLoad = require('gulp-load-plugins')();
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');

let APPLICATION_DIST_PATH = './lib';

const buildWithBabel = () => {
    return gulp.src(['./source/**/*.js', './source/**/*.jsx'])
        .pipe(babel())
        .pipe(buffer()).pipe(uglify())
        .pipe(gulp.dest(APPLICATION_DIST_PATH));
};

const buildWithBabelTS = () => {
    const options = { jsx: 'react', moduleResolution: 'node', target: 'esNext', experimentalDecorators: true };
    return gulp.src(['./source/**/*.ts', './source/**/*.tsx'])
        .pipe(ts(options))
        .pipe(babel())
        .pipe(buffer()).pipe(uglify())
        .pipe(gulp.dest(APPLICATION_DIST_PATH));
};

const buildStyles = (serve = false) => {
    let result = gulp.src('./source/module/**/*.scss')
        .pipe(sassGlob())
        .pipe(lazyLoad.sourcemaps.init())
        .pipe(lazyLoad.sass({ style: 'expanded' })).on('error', errorHandler('Sass'))
        .pipe(lazyLoad.autoprefixer()).on('error', errorHandler('Autoprefixer'));
    if (!serve) {
        result = result.pipe(cleanCSS({ compatibility: 'ie9', rebase: false }));
    }
    result = result.pipe(lazyLoad.sourcemaps.write())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}`));
    return result;
};

const errorHandler = title => {
    return err => {
        gutil.log(gutil.colors.red(`[${title}]`), err.toString());
        this.emit('end');
    };
};

/** GULP TASKS */

gulp.task('clean', callback => del(APPLICATION_DIST_PATH, callback));

gulp.task('ts-lint', () => {
    return gulp
        .src(['./source/**/*.ts', './source/**/*.tsx', '!./source/**/*.spec.ts', '!./source/**/*.spec.tsx'])
        .pipe(
            tslint({
                program: require('tslint').Linter.createProgram('./tsconfig.json'),
            }),
        )
        .pipe(
            tslint.report({
                summarizeFailureOutput: true,
            }),
        );
});

gulp.task('lint', () => {
    return gulp
        .src(['./source/**/*.js', './source/**/*.jsx', '!./source/assets/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('js', gulp.series(
    gulp.parallel('ts-lint', 'lint'),
    callback => {
        buildWithBabel();
        buildWithBabelTS();
        return callback();
    },
));

gulp.task('d.ts', () => {
    return gulp.src('./source/*.d.ts')
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}`));
});

gulp.task('sass', (callback) => {
    buildStyles();
    return callback();
});

gulp.task('assets-files', () => {
    return gulp.src('./source/assets/**/*')
        .pipe(gulp.dest(`${APPLICATION_DIST_PATH}/assets`));
});

gulp.task('build',
    gulp.series('clean',
        gulp.parallel('assets-files', 'js', 'd.ts', 'sass'),
        callback => {
            callback();
        },
    ),
);
