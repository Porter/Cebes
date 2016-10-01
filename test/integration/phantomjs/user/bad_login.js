var page = require('webpage').create();
var chai = require("chai");
var expect = chai.expect;
chai.use(require('chai-string'));
var Promise = require("bluebird");

function waitForIt(fn, times) {
  return new Promise(function(resolve, reject) {
    try {
      fn();
      resolve();
    }
    catch(e) {
      if (times <= 1) {
        return reject(e);
      }
      setTimeout(function() {
        waitForIt(fn, times-1).then(resolve).catch(reject);
      }, 100);
    }
  });
}

function login() {
  var urlChanged = false;
  // page.onLoadFinished = function() {
  //   if (urlChanged && !textCorrect) {
  //     try {
  //       expect(page.plainText).to.contain("You are logged in as Username");
  //       textCorrect = true;
  //     }
  //     catch (e) {
  //       console.error(e);
  //     }
  //   }
  // };
  page.onUrlChanged = function(newUrl) {
    if (urlChanged) return;
    try {
      expect(newUrl).to.endWith("/users/login");
      urlChanged = true;
    }
    catch(e) {
      //console.error(e);
    }
  };

  return new Promise(function(resolve, reject) {
    page.open('http://127.0.0.1:9000/users/login', function(status) {

      page.evaluate(function() {
        $("#usernameInput").val("Username");
        $("#passwordInput").val("bad_password");
        $("#logInButton").click();
      });

      waitForIt(function() {
        expect(urlChanged).to.eql(true);
      }, 20).then(resolve).catch(error);
    });
  });
}

login()
.then(function() {
  phantom.exit();
})
.catch(function(e) {
  console.error(e);
  phantom.exit()
})
