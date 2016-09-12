const _ = require("lodash");
const pg = require('pg');
const Promise = require("bluebird");

var config = {
  user: process.env.PGUSER, //env var: PGUSER
  database: process.env.PGDATABASE, //env var: PGDATABASE
  password: process.env.PGPASSWORD, //env var: PGPASSWORD
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};


var pool;

function makeQuery(query, params) {
  return new Promise((resolve, reject) => {
    if (!pool) { return reject(new Error("db helper not initiated")); }
    pool.connect(function(err, client, done) {
      if(err) {
        return reject(err);
      }

      client.query(query, params, function(err, result) {
        //call `done()` to release the client back to the pool
        done();

        if(err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  });
}

function insertInto(table, data) {
  const keys = Object.keys(data);
  const values = keys.map(key => { return data[key]; });

  const columnString = '(' + keys.join(',') + ')';
  const valueNumbers = [];
  for (var i = 1; i <= keys.length; i++) {
    valueNumbers.push("$" + i);
  }
  const valueString = '(' + valueNumbers.join(',') + ')';

  let query = `INSERT INTO ${table} ${columnString} VALUES ${valueString}`;
  return makeQuery(query, values);
}

function update(table, data, where) {
  const keys = Object.keys(data);
  const values = [];

  const setStrings = [];
  for (var i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = data[key];
    setStrings.push(`${key}=$${i+1}`);
    values.push(value);
  }
  const valueString = setStrings.join(',');

  where.appendToValues(values);
  let query = `UPDATE ${table} SET ${setStrings} ${where.toString(keys.length)}`;
  return makeQuery(query, values);
}

function selectFrom(table, values) {
  if (typeof values == 'string') {
    values = [values];
  }
  const valueString = values.join(',');
  const query = `SELECT ${valueString} FROM ${table}`;
  return makeQuery(query);
}

function init(customConfig) {
  if (pool) { return; }
  pool = new pg.Pool(_.merge(config, customConfig));

  pool.on('error', function (err, client) {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    console.error('idle client error', err.message, err.stack)
  });
}


function clearUsers(table) {
  return makeQuery("DELETE FROM users WHERE 1=1;");
}

class where {
  constructor() {
    this.conditions = [];
  }

  toString(start) {
    if (this.conditions.length == 0) {
      return '';
    }
    let strings = []
    for (var i = 0; i < this.conditions.length; i++) {
      let condition = this.conditions[i];

      strings.push(`${condition.column}${condition.trueOperator}$${i+1+start}`)
    }
    return 'WHERE ' + strings.join(",")
  }

  column(column) {
    if (this.columnValue) { throw new Error("can't call #column twice in a row"); }
    this.columnValue = column;

    return this;
  }

  equals(value) {
    if (!this.columnValue) { throw new Error("need to call #column first"); }
    this.conditions.push({
      value: value,
      column: this.columnValue,
      trueOperator: "="
    });
    delete this.columnValue;

    return this;
  }

  appendToValues(values) {
    this.conditions.forEach(condition => {
      values.push(condition.value);
    });
  }
}

module.exports = {
  makeQuery: makeQuery,
  insertInto: insertInto,
  update: update,
  selectFrom: selectFrom,
  clearUsers: clearUsers,
  where: where,
  init: init
}
