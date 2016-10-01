var page = require('webpage').create();
const expect = require('chai').expect;
page.open('http://127.0.0.1:9000/', function(status) {
  try {
    expect(status).to.eql("success");
  }
  catch (e) {
    console.error(e);
    return phantom.exit(0);
  }
  phantom.exit();
});
