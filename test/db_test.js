const expect = require('chai').expect;
require("../env");
const DB = require("../helpers/db");

describe('The database', () => {

  before(done => {
    DB.init();
    DB.clearUsers()
    .then(r => { done(); })
    .catch(e => { done(e); });
  });

  it('can run a query', done => {
    DB.makeQuery('SELECT $1::int AS number', ['1']).then(result => {
      try {
        expect(result.rows).to.eql([{number:1}]);
        done();
      }
      catch(e) {
        done(e);
      }
    });
  });

  describe('data persistance', () => {
    it('inserts', done => {
      DB.makeQuery('INSERT INTO users (username) VALUES ($1)', ['asdf']).then(result => {
        try {
          expect(result).to.have.property("command", "INSERT");
          expect(result).to.have.property("rowCount", 1);
          done();
        }
        catch(e) {
          done(e);
        }
      });
    });
    it('retrieves', done => {
      DB.makeQuery('SELECT username from users').then(result => {
        try {
          expect(result.rows).to.eql( [{username:'asdf'}] );
          done();
        }
        catch(e) {
          done(e);
        }
      });
    });
  });

  describe('constraints', () => {
    it('throws an error for duplicate usernames', done => {
      DB.makeQuery('INSERT INTO users (username) VALUES ($1)', ['asdf'])
      .then(result => {
        done(new Error("this wasn't supposed to succeed. Username is not unique"));
      })
      .catch(e => {
        expect(e).to.have.property('message', 'duplicate key value violates unique constraint "users_username_key"');
        done();
      });
    });
  });

});