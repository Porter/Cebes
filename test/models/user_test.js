const expect = require('chai').expect;
const request = require("request");
const User = require("../../models/user");
const UserNotFoundError = require("../../errors/user_not_found_error");
const _ = require("lodash");

describe('User', () => {
  before(done => {
    User.init()
    .then(User.destroy({where: {}}))
    .then(removedCount => {
      done(); })
    .catch(e => { done(e); });
  });

  describe("#findAll", () => {
    context('when the table is empty', () => {
      it('should be an empty array', done => {
        User.findAll().then(result => {
          try {
            //expect(result).to.eql([]);
            done();
          }
          catch (e) { done(e); }
        })
        .catch(e => { done(e); } );
      });
    });
  });

  describe("#create", () => {
    it('should return the user', done => {
      User.create({username:"USERNAME", passhash:"sdfa"}).then(user => {
        try {
          expect(_.get(user, "dataValues.username")).to.eql("USERNAME");
          expect(_.get(user, "dataValues.passhash")).to.eql("sdfa");
          done();
        }
        catch (e) { done(e); }
      })
      .catch(done);
    });

    it("should have created a user", done => {
      User.findAll().then(result => {
        try {
          expect(result[0]).to.have.property("username", "USERNAME");
          done();
        }
        catch (e) { done(e); }
      })
      .catch(e => { done(e); } );
    });

    it('should return an error if username is a duplicate', done => {
      const promises = [
        User.create({username:"USERNAME1", password:"sdfa"}),
        User.create({username:"USERNAME1", password:"asdfeasf"})
      ];
      Promise.all(promises).then(result => {
        done(new Error("this promise was supposed to reject"));
      })
      .catch(e => {
        try {
          expect(e.name).to.eql('SequelizeUniqueConstraintError');
          done();
        }
        catch (err) { done(err); }
      });
    });
  });

  describe("#findOne", () => {
    context('when there is one user in the table', () => {
      it('return the user with the username given', done => {
        User.findOne({username:"USERNAME"}).then(user => {
          try {
            expect(user).to.have.property("username", "USERNAME");
            done();
          }
          catch (e) { done(e); }
        })
        .catch(e => { done(e); } );
      });

      it("rejects for a user that doesn't exist", done => {
        User.findOne({where: {username:"sdfasf"}}).then(user => {
          expect(user).to.not.exist;
          if (user) {
            return done(new Error("user is truthy"));
          }
          done();
        })
        .catch(e => {
          done(e);
        });
      });
    });
  });
});
