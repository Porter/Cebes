var webpage = require('webpage');
var page = webpage.create();
var expect = require("chai").expect;
var Promise = require("bluebird");

function waitForInitiation(phantomPage) {
  return waitForIt(function () {
    var inited = phantomPage.evaluate(function() {
      return frontEnd.isInited();
    });
    expect(inited).to.eql(true);
  });
}

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

function openNewBrowser() {
  return new Promise(function(resolve, reject) {
    page.open('http://127.0.0.1:9000/documents/edit?id=1', function(status) {
      waitForInitiation(page).then(function() {
        var html = page.evaluate(function() {
          return $("#rootDiv").html();
        });
        expect(html).to.eql('abc');
        resolve();
     }).catch(reject);
    });
  });
}

function waitForABit() {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 500);
  });
}

function waitForDocumentChange() {
  return new Promise(function(resolve, reject) {
    waitForIt(function () {
      var html = page.evaluate(function() {
        return $("#rootDiv").html();
      });
      expect(html).to.contain("abcabc");
    }, 40).then(resolve).catch(reject);
  });
}

openNewBrowser()
.then(waitForABit)
.then(waitForDocumentChange)
.then(function() {
  phantom.exit();
})
.catch(function(e) {
  console.error(e);
  phantom.exit()
})
