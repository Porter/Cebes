var page = require('webpage').create();
page.open('http://127.0.0.1:9000/documents', function(status) {
  console.log(page.plainText);
  phantom.exit();
});
