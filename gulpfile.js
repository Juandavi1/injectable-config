const gulp = require('gulp');
const uglify = require('gulp-uglify-es').default

gulp.task('default', () =>
    gulp.src('dist/injectable-config.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/'))
);