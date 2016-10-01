const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs');
const binPath = phantomjs.path;

module.exports = {
  run: function (folder, name) {
    return new Promise(function(resolve, reject) {
      const script = path.join(__dirname, '/phantomjs/', folder, name + '.js');
      childProcess.execFile(binPath, [script], function(err, stdout, stderr) {
        if (err) return reject(err);
        if (stdout) return reject(stdout);
        if (stderr) return reject(stderr);
        resolve();
      });
    });
  }
}
