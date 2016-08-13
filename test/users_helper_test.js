const expect = require('chai').expect;
const request = require("request");
const DB = require("../helpers/db");
const usersHelper = require("../helpers/users_helper");
const UserNotFoundError = require("../errors/user_not_found_error");

describe('UsersHelper', () => {
  before(done => {
    DB.init();
    DB.clearUsers()
    .then(r => { done(); })
    .catch(e => { done(e); });
  });

  describe("#getAll", () => {
    context('when the table is empty', () => {
      it('should be an empty array', done => {
        usersHelper.getAll().then(result => {
          try {
            expect(result).to.eql([]);
            done();
          }
          catch (e) { done(e); }
        })
        .catch(e => { done(e); } );
      });
    });
  });

  describe("#createUser", () => {
    it('should indicate success', done => {
      usersHelper.createUser({name:"USERNAME"}).then(result => {
        try {
          expect(result).to.eql({result:"success"});
          done();
        }
        catch (e) { done(e); }
      })
      .catch(e => { done(e); } );
    });

    it("should have created a user", done => {
      usersHelper.getAll().then(result => {
        try {
          expect(result).to.eql( [{username:"USERNAME"}] );
          done();
        }
        catch (e) { done(e); }
      })
      .catch(e => { done(e); } );
    });

    it('should return an error if username is null', done => {
      usersHelper.createUser({name:"USERNAME"}).then(result => {
        done(new Error("this promise was supposed to reject"));
      })
      .catch(e => {
        expect(e.message).to.eql('duplicate key value violates unique constraint "users_username_key"');
        done();
      });
    });
  });

  describe("#getUser", () => {
    context('when there is one user in the table', () => {
      it('return the user with the username given', done => {
        usersHelper.getUser({name:"USERNAME"}).then(result => {
          try {
            expect(result).to.eql({username:"USERNAME"});
            done();
          }
          catch (e) { done(e); }
        })
        .catch(e => { done(e); } );
      });

      it("rejects for a user that doesn't exist", done => {
        usersHelper.getUser({name:"sdfasf"}).then(result => {
          done(new Error("this promise was supposed to reject"));
        })
        .catch(e => {
          //expect(e).to.be.instanceof(UserNotFoundError);
          try {
            expect(e).to.have.property("message", "Cannot find user with username sdfasf");
            done();
          }
          catch(e) { done(e); }
       });
      });
    });
  });
});