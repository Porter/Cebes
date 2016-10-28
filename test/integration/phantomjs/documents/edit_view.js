var webpage = require('webpage');
var page = webpage.create();
var expect = require("chai").expect;
var Promise = require("bluebird");

function waitForInitiation(phantomPage) {
  return waitForIt(function () {
    var inited = phantomPage.evaluate(function() {
      try {
        return frontEnd.isInited();
      }
      catch(e) { return false; }
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

function visitEditPage() {
  return new Promise(function(resolve, reject) {
    page.open('http://127.0.0.1:9000/documents', function(status) {
      var madeIt = false;
      page.onUrlChanged = function(newUrl) {
        if (madeIt) return;
        try {
          expect(newUrl).to.contain("/documents/edit?id=1");
          madeIt = true;
        }
        catch(e) {
          console.error(e);
        }
      };

      page.evaluate(function() {
        $("#newDocumentButton").click();
      });

      waitForIt(function() {
        expect(madeIt).to.eql(true);
      }, 10).then(resolve).catch(reject);

    });
  });
}

function editRootDiv() {
  return new Promise(function(resolve, reject) {
    waitForInitiation(page).then(function(r) {
      var html = page.evaluate(function() {
        return $("#rootDiv").html();
      });
      expect(html).to.eql('');

      page.evaluate(function() {
        $("#rootDiv").focus();
      });
      page.sendEvent('keypress', 'abc');

      waitForIt(function () {
        var html = page.evaluate(function() {
          return $("#rootDiv").html();
        });
        var upToDate = page.evaluate(function() {
          return frontEnd.isUpToDate();
        });
        var divText = page.evaluate(function() {
          return frontEnd.getDivText();
        });
        expect(html).to.contain("abc");
        expect(divText).to.eql("abc");
        expect(upToDate).to.eql(true);
      }, 30).then(resolve).catch(reject);
    }).catch(reject);
  });
}

function refresh() {
  return new Promise(function(resolve, reject) {
    page.reload();
    waitForInitiation(page).then(function(r) {
      var html = page.evaluate(function() {
        return $("#rootDiv").html();
      });
      expect(html).to.eql('abc');
      resolve();
    }).catch(reject);
  });
}



visitEditPage()
.then(editRootDiv)
.then(refresh)
.then(function() {
  setTimeout(phantom.exit, 2000);
})
.catch(function(e) {
  console.error(e);
  phantom.exit()
})
