const browserify = require("browserify");
const gulp = require('gulp');
const fs = require('fs');
const Promise = require("bluebird")

var writeStream = fs.createWriteStream('./public/js/bundle.js');

module.exports = () => {
  return new Promise(function(resolve, reject) {
    fs.unlink("./build/output.js", err => {
      if (err) return reject(err);
      resolve();
    })
  });
}
