var page = require('webpage').create();
var expect = require("chai").expect;
page.open('http://127.0.0.1:9000/', function(status) {
  try {
    expect(page.plainText).to.contain("Hello worldasfd");
  }
  catch(e) {
    console.error(e);
    phantom.exit();
  }
  phantom.exit();
});
