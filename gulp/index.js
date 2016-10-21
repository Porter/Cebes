var gulp = require('gulp');

module.exports = function(tasks) {
    tasks.forEach(function(task) {
        gulp.task(task.name, task.dependencies, require('./tasks/' + task.name));
    });

    return gulp;
};
