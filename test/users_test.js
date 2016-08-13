const Browser = require('zombie');
const expect = require('chai').expect;

Browser.localhost('127.0.0.1', 9000);

describe('User auth', () => {

  const browser = new Browser();

  describe("Signup", () => {

    it('can visit /signup', done => {
      browser.visit('/signup', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });


    it("should be able to signup with a username", done => {
      browser
        .fill('user[name]',    'Username')
        .fill('user[password]', 'password')
        .pressButton('Sign Up', done);
    });
  });

  describe("Login", () => {

    it('can visit /login', done => {
      browser.visit('/login', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });


    it("should be able to login with a username", done => {
      browser
        .fill('user[name]',    'Username')
        .fill('user[password]', 'password')
        .pressButton('Log in', done);
    });
  });
});