const DB = require("../helpers/db");
const Promise = require("bluebird");
const UserNotFoundError = require("../errors/user_not_found_error");

DB.init();


function getAll() {
  return new Promise((resolve, reject) => {
    DB.makeQuery("SELECT * FROM users;")
    .then(result => { resolve(result.rows); })
    .catch(e => { reject(e) } );
  });
}

function getUser(user) {
  return new Promise((resolve, reject) => {
    DB.makeQuery("SELECT * FROM users WHERE username=$1", [user.name])
    .then(result => {
      if (result.rows.length == 0) {
        return reject(new UserNotFoundError("Cannot find user with username " + user.name));
      }
      resolve(result.rows[0]);
    })
    .catch(e => {reject(e); });
  });
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    DB.makeQuery("INSERT INTO users (username) VALUES ($1);", [user.name])
    .then(result => { resolve({result:"success"}); })
    .catch(e => { reject(e); });
  });
}


module.exports = {
  getAll: getAll,
  getUser: getUser,
  createUser: createUser
};