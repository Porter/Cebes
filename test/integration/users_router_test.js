const Browser = require('zombie');
const expect = require('chai').expect;
const User = require("../../models/user");

Browser.localhost('127.0.0.1', 9000);

function login(browser, callback) {
  browser.visit('/users/login', err => {
    if (err) return callback(err);
    browser
      .fill('username',    'Username')
      .fill('password', 'password')
      .pressButton('Log in', callback);
  });
}

describe('User auth @integration', () => {

  const browser = new Browser();

  before(done => {
    User.init().then(result => {
      User.destroy({where: {}}).then(removedCount => {
        done();
      })
    });
  });

  describe("Signup", () => {

    it('can visit /users/signup', done => {
      browser.visit('/users/signup', done);
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

    it("should start with zero users", done => {
      User.findAll({}).then(users => {
        try {
          expect(users).to.have.property('length', 0);
          done();
        }
        catch (e) { done(e); }
      })
    })

    it("should be able to signup with a username", done => {
      try {
        browser
          .fill('username',    'Username')
          .fill('password', 'password')
          .pressButton('Sign Up', err => {
            if (err) done(err);
            try {
              browser.assert.redirected();
              browser.assert.url('/');
              expect(browser.text()).to.contain("You are logged in as Username");
            }
            catch(e) { return done(e); }
            done();
          });
        }
        catch(e) { done(e); }
    });

    it('can logout and signup again', done => {
      browser.visit('/users/logout', err => {
        if (err) return done(err);
        browser.visit("/users/signup", done);
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
      User.findOne({where: {username:"Username"}}).then(user => {
        done();
      })
      .catch(e => { done(e); });
    });
  });

  describe("Login", () => {

    it('can visit /users/login', done => {
      browser.visit('/users/login', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });

    it("redirect to /users/login for bad credentials", done => {
      browser
        .fill('username',    'Username')
        .fill('password', 'safsadfewafdsf')
        .pressButton('Log in', err => {
          if (err) {
            return done(err);
          }
          browser.assert.redirected();
          browser.assert.url('/users/login');
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

    it('can visit /users/logout', done => {
      browser.visit('/users/logout', done);
    });

    it('was successful', () => {
      browser.assert.success();
    });

    it("was redirected to /", () => {
      browser.assert.redirected();
      browser.assert.url('/');
    });

    it("has the right links", () => {
      browser.assert.link('a', 'Sign Up', '/users/signup');
      browser.assert.link('a', 'Login', '/users/login');
    })

    it('can click the link to logout', (done) => {
      login(browser, err => {
        if (err) return done(err);
        browser.clickLink("Log out", err => {
          if (err) return done(err);
          browser.assert.redirected();
          browser.assert.url('/');
          browser.assert.link('a', 'Sign Up', '/users/signup');
          browser.assert.link('a', 'Login', '/users/login');
          done();
        });
      });
    })
  });
});
