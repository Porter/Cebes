var gulp = require('./gulp/index')([
    {
      name: 'browserify',
      dependencies: []
    },
    {
      name: 'babel',
      dependencies: ['browserify']
    },
    {
      name: 'clean',
      dependencies: ['babel']
    }
]);

gulp.task('build', ['browserify', 'babel', 'clean']);
gulp.task('b', ['build']);
