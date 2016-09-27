var page = require('webpage').create();
page.open('http://127.0.0.1:9000/documents', function(status) {
  var links = page.evaluate(function() {
      var links =  $('a'), r = [];
      for (var i = 0; i < links.length; i++) {
        r.push(links[i].href)
      }
      return r;
  });
  console.log(links.join('\n'));
  phantom.exit();
});
