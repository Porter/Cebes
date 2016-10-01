var page = require('webpage').create();
var chai = require("chai");
var expect = chai.expect;
chai.use(require('chai-string'));
var Promise = require("bluebird");

function visit_login() {
  return new Promise(function(resolve, reject) {
    page.open('http://127.0.0.1:9000/users/signup', function(status) {
      try {
        expect(status).to.eql("success");
        resolve();
      }
      catch(e) {
        reject(e);
      }
    });
  });
}


visit_login()
.then(function() {
  phantom.exit();
})
.catch(function(e) {
  console.error(e);
  phantom.exit()
})
