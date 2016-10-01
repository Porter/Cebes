var page = require('webpage').create();
var expect = require("chai").expect;
page.open('http://127.0.0.1:9000/documents', function(status) {
  expect(page.plainText).to.contain("New");
  phantom.exit();
});
