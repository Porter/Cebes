const babel = require('babel-core');
const gulp = require('gulp');
const fs = require('fs');
const Promise = require('bluebird');

module.exports = () => {
  return new Promise((resolve, reject) => {
    babel.transformFile("./build/output.js", {}, function (err, result) {
      if (err) { return reject(err); }
      fs.writeFile('./public/js/bundle.js', result.code, err => {
        if (err) { return reject(err); }
        resolve();
      });
    });
  });
}
