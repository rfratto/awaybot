var gulp = require('gulp'),
    jasmine = require('gulp-jasmine');

gulp.task('default', ['test']);

gulp.task('test', function(cb) {
	gulp.src('spec/**/*.test.js')
	.pipe(jasmine())
	.on('end', cb);
});
