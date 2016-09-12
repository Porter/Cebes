const expect = require('chai').expect;
require("../../env");
const DB = require("../../helpers/db");
const where = DB.where;

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
      DB.makeQuery('INSERT INTO users (username, passhash) VALUES ($1, $2)', ['asdf', 'asdf']).then(result => {
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
    it('inserts 2', done => {
      DB.insertInto('users', {username:'asdf2', passhash: 'asdf2'}).then(result => {
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
          expect(result.rows).to.eql( [{username:'asdf'}, {username:'asdf2'}] );
          done();
        }
        catch(e) {
          done(e);
        }
      });
    });
    it('retrieves 2', done => {
      DB.selectFrom('users', 'username').then(result => {
        try {
          expect(result.rows).to.eql( [{username:'asdf'}, {username:'asdf2'}] );
          done();
        }
        catch(e) {
          done(e);
        }
      });
    });
    it('retrieves 3', done => {
      DB.selectFrom('users', ['username', 'passhash']).then(result => {
        try {
          expect(result.rows).to.eql( [{username:'asdf', passhash:'asdf'}, {username:'asdf2', passhash:'asdf2'}] );
          done();
        }
        catch(e) {
          done(e);
        }
      });
    });
    it('updates', done => {
      const condition = new where().column('username').equals('asdf');
      DB.update('users', {passhash: 'changed'}, condition).then(result => {
        done();
      }).catch(done);
    });
    it('retrieves 4', done => {
      DB.selectFrom('users', ['username', 'passhash']).then(result => {
        try {
          expect(result.rows).to.eql( [{username:'asdf2', passhash:'asdf2'}, {username:'asdf', passhash:'changed'}] );
          done();
        }
        catch(e) {
          done(e);
        }
      }).catch(done);
    });
  });

  describe('constraints', () => {
    it('throws an error for duplicate usernames', done => {
      DB.makeQuery('INSERT INTO users (username, passhash) VALUES ($1, $2)', ['asdf', 'asdf'])
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
