const DB = require("../helpers/db");
const Promise = require("bluebird");
const bcrypt = require('bcrypt');
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
    if (!user) {
      return reject(new UserNotFoundError("Cannot not find user with defintion " + user));
    }
    var possibleConditions = ["username", "id"], condition, value;
    for (var i = 0; i < possibleConditions.length; i++) {
      var possibleCondition = possibleConditions[i];
      if (user[possibleCondition]) {
        condition = possibleCondition;
        value = user[possibleCondition];
        break;
      }
    }
    if (!condition) {
      return reject(new Error("Cannot find a user " + JSON.stringify(user)));
    }

    DB.makeQuery(`SELECT * FROM users WHERE ${condition}=$1`, [value])
    .then(result => {
      if (result.rows.length == 0) {
        return reject(new UserNotFoundError("Cannot find user with " + condition + " " + value));
      }
      resolve(result.rows[0]);
    })
    .catch(e => {reject(e); });
  });
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    if (!user.password) {
      return reject(new Error("missing password when creating user"));
    }

    bcrypt.hash(user.password, 5, function(err, passhash) {
      if (err) return reject(err);
      DB.makeQuery("INSERT INTO users (username, passhash) VALUES ($1, $2);", [user.username, passhash])
      .then(result => { resolve({result:"success"}); })
      .catch(e => { reject(e); });
    });
  });
}


module.exports = {
  getAll: getAll,
  getUser: getUser,
  createUser: createUser
};