const browserify = require("browserify");
const gulp = require('gulp');
const fs = require('fs');

var writeStream = fs.createWriteStream('./build/output.js');

module.exports = () => {
  return browserify("./frontEnd/socket_io_handler.js", {standalone: 'frontEnd'})
  .bundle()
  .pipe(writeStream);
}
