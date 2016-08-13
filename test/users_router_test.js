const Browser = require('zombie');
const expect = require('chai').expect;
const usersHelper = require("../helpers/users_helper");

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
        .fill('username',    'Username')
        .fill('password', 'password')
        .pressButton('Sign Up', done);
    });

    it("should have made a user", done => {
      usersHelper.getUser({username:"Username"}).then(user => {
        done();
      })
      .catch(e => { done(e); });
    });
  });

  describe("Login", () => {

    it('can visit /login', done => {
      browser.visit('/login', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });

    it("redirect to /login for bad credentials", done => {
      browser
        .fill('username',    'Username')
        .fill('password', 'safsadfewafdsf')
        .pressButton('Log in', err => {
          if (err) {
            return done(err);
          }
          browser.assert.redirected();
          browser.assert.url('/login');
          done();
        });
    });


    it("should be able to login with a username", done => {
      browser
        .fill('username',    'Username')
        .fill('password', 'password')
        .pressButton('Log in', err => {
          if (err) {
            return done(err);
          }
          browser.assert.redirected();
          browser.assert.url('/');
          done();
        });
    });
  });
});