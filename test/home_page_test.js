const Browser = require('zombie');
const expect = require('chai').expect;

Browser.localhost('127.0.0.1', 8080);

describe('User visits signup page', function() {

  const browser = new Browser();

  before(function(done) {
    browser.visit('/', done);
  });

  it('should be successful', function() {
    browser.assert.success();
  });

  describe('home page content', function() {
    it('should have hello world', function() {
      expect(browser.text()).to.contain("Hello world");
    });
  });
});