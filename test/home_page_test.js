const Browser = require('zombie');
const expect = require('chai').expect;

Browser.localhost('127.0.0.1', 8080);

describe('User visits signup page', () => {

  const browser = new Browser();

  before(done => {
    browser.visit('/', done);
  });

  it('should be successful', () => {
    browser.assert.success();
  });

  describe('home page content', () => {
    it('should have hello world', () => {
      expect(browser.text()).to.contain("Hello world");
    });
  });
});