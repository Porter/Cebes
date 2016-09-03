const Browser = require('zombie');
const expect = require('chai').expect;
const usersHelper = require("../../helpers/users_helper");

Browser.localhost('127.0.0.1', 9000);

function login(browser, callback) {
  browser.visit('/login', err => {
    if (err) return done(err);
    browser
      .fill('username',    'Username')
      .fill('password', 'password')
      .pressButton('Log in', callback);
  });
}

describe('User auth', () => {

  const browser = new Browser();

  describe("Signup", () => {

    it('can visit /signup', done => {
      browser.visit('/signup', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });

    it("shouldn't be able to signup with just an email");/*, done => {
      browser
        .fill('email',    'joeBloe@gmail.com')
        .fill('password', 'password')
        .pressButton('Sign Up', err => {
          if (err) done(err);
          browser.assert.url('/signup');
          expect(browser.text()).to.contain("Username can't be blank");
          done();
        });
    });*/


    it("should be able to signup with a username", done => {
      browser
        .fill('username',    'Username')
        .fill('password', 'password')
        .pressButton('Sign Up', err => {
          if (err) done(err);
          browser.assert.redirected();
          browser.assert.url('/');
          expect(browser.text()).to.contain("You are logged in as Username");
          done();
        });
    });

    it('can logout and signup again', done => {
      browser.visit('/logout', err => {
        if (err) return done(err);
        browser.visit("/signup", done);
      });
    });

    it("should be able to signup with a username and an email");/*, done => {
      browser
        .fill('username',    'Porter')
        .fill('email',    'pmh192@gmail.com')
        .fill('password', 'password')
        .pressButton('Sign Up', err => {
          if (err) done(err);
          expect(browser.text()).to.contain("Username can't be blank");
          done();
        });
    });*/

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
      login(browser, err => {
          if (err) {
            return done(err);
          }
          browser.assert.redirected();
          browser.assert.url('/');
          expect(browser.text()).to.contain("You are logged in as Username");
          done();
      });
    });
  });

  describe("Logout", () => {

    it('can visit /logout', done => {
      browser.visit('/logout', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });

    it("was redirected", () => {
      browser.assert.redirected();
      browser.assert.url('/');
      browser.assert.link('a', 'Sign Up', '/signup');
      browser.assert.link('a', 'Login', '/login');
    });

    it('can click the link to logout', (done) => {
      login(browser, err => {
        if (err) return done(err);
        browser.clickLink("Log out", err => {
          if (err) return done(err);
          browser.assert.redirected();
          browser.assert.url('/');
          browser.assert.link('a', 'Sign Up', '/signup');
          browser.assert.link('a', 'Login', '/login');
          done();
        });
      });
    })
  });
});