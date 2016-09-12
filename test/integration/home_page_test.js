const Browser = require('zombie');
const expect = require('chai').expect;

Browser.localhost('127.0.0.1', 9000);

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

    it('should have a link to signup', () => {
      browser.assert.link('a', 'Sign Up', '/signup');
    });

    it('should have a link to login', () => {
      browser.assert.link('a', 'Login', '/login');
    });
  });
});