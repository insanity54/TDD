var gulp, livereload, shell, injectReload, st, http;

gulp = require('gulp');
shell = require('gulp-shell');
livereload = require('gulp-livereload');
injectReload = require('gulp-inject-reload');
st = require('st');
http = require('http');
path = require('path');



gulp.task('watch', [
  'watchify',
  'reload'
]);

gulp.task('build', [
  'browserify',
  'html-prod'
]);

gulp.task('browserify', shell.task(
  "browserify client/main.js --outfile dist/js/bundle.js"
))

gulp.task('watchify', shell.task(
  "node node_modules/watchify/bin/cmd.js client/main.js --outfile dist/js/bundle.js --debug"
));


gulp.task('html-dev', function() {
  /** inject livereload js into page */
  gulp.src('client/index.html')
    .pipe(injectReload({
      host: 'http://127.0.0.1'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('reload', function() {
  /* reload dev server when changes are seen */
  livereload.listen();
  return gulp.watch('./dist/js/bundle.js')
    .on('change', function(file) {
      return livereload.changed(file.path);
    });
});

gulp.task('serve', function(done) {
  http.createServer(
    st({
      path: path.join(__dirname, 'dist'),
      index: 'index.html',
      cache: false
    }))
    .listen(8080, done);
});

gulp.task('default', ['watch', 'serve']);
