var page = require('webpage').create();
const expect = require('chai').expect;
page.open('http://127.0.0.1:9000/', function(status) {
  var links = page.evaluate(function() {
      var links =  $('a'), r = [];
      for (var i = 0; i < links.length; i++) {
        r.push(links[i].href)
      }
      return r;
  });
  try {
    expect(links[0]).to.contain("/users/login");
    expect(links[1]).to.contain("/users/signup");
  }
  catch(e) {
    console.error(e);
    phantom.exit();
  }
  phantom.exit();
});
