const expect = require('chai').expect;
const User = require("../../models/user");
const testHelper = require("./test_helper")

const folder = "user";

describe('User auth @integration', () => {

  before(done => {
    User.init().then(result => {
      User.destroy({where: {}}).then(removedCount => {
        done();
      })
    });
  });

  describe("Signup", () => {

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

    it("should be able to complete the auth flow", done => {
      testHelper.run(folder, "auth_flow").then(done).catch(done);
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
      testHelper.run(folder, "visit_login").then(done).catch(done);
    });

    it("redirect to /users/login for bad credentials", done => {
      testHelper.run(folder, "bad_login").then(done).catch(done);
    });
  });

  describe("Logout", () => {

    before(done => {
      testHelper.run(folder, "logout").then(done).catch(done);
    });

    it('can click the link to logout', () => { })

    it('was successful', () => { });

    it("was redirected to /", () => {});

  });
});
