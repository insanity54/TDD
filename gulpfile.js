var gulp = require('gulp');
var gls = require('gulp-live-server');
var shell = require('gulp-shell');
var injectReload = require('gulp-inject-reload');


var paths = {
  js: 'dist/js/**/*.js',
  html: 'dist/**/*.html'
}


gulp.task('watch', [
  'watchify',
  'html'
]);

gulp.task('build', [
  'browserify',
  'html'
]);

gulp.task('browserify', shell.task(
  "node node_modules/browserify/bin/cmd.js client/main.js --outfile dist/js/bundle.js"
));

gulp.task('watchify', shell.task(
  "node node_modules/watchify/bin/cmd.js client/main.js --outfile dist/js/bundle.js --debug"
));


gulp.task('html', function() {
  gulp.watch('client/index.html')
    .on('change', function(file) {
      gulp.src('client/index.html')
        .pipe(gulp.dest('dist/index.html'));
    });
});


gulp.task('serve', function(done) {
  var server = gls.static('dist', 8080);
  server.start();

  gulp.watch([paths.js, paths.html], function(file) {
    console.log('change in file '+file.path);
    server.notify.apply(server, [file]);
  });
});

gulp.task('default', ['serve', 'watch']);
