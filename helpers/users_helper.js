const DB = require("../helpers/db");
const Promise = require("bluebird");
const bcrypt = require('bcrypt');
const UserNotFoundError = require("../errors/user_not_found_error");
const UserValidationError = require("../errors/user_validation_error");

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
    const validationError = validateNewUser(user);
    if (validationError) {
      return reject(validationError);
    }

    const toStore = ["username", "email"];
    var columns = [], values = [];
    toStore.forEach(column => {
      if (user[column]) {
        columns.push(column);
        values.push(user[column]);
      }
    });
    columns.push("passhash");

    var columnsString = "(" + columns.join(",") + ")";

    var valuesString = "(";
    for (var i = 1; i < columns.length+1; i++) {
      valuesString += "$" + i;
      if (i != columns.length) valuesString += ","
    }
    valuesString += ")";


    bcrypt.hash(user.password, 5, function(err, passhash) {
      if (err) return reject(err);

      values.push(passhash);
      DB.makeQuery(`INSERT INTO users ${columnsString} VALUES ${valuesString};`, values)
      .then(result => { resolve({result:"success"}); })
      .catch(e => { reject(e); });
    });
  });
}

function validateNewUser(user) {
  var errors = [];
  if (!user.password || user.password === '') {
    errors.push("Password can't be blank");
  }
  if (!user.username || user.username === '') {
    errors.push("Username can't be blank");
  }

  if (user.username.indexOf('@') != -1) {
    errors.push("Username can't have '@' in it");
  }

  const emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
  if (user.email && !emailRegex.exec(user.email)) {
    errors.push(user.email + " isn't a valid email address");
  }

  if (errors.length > 0) {
    return new UserValidationError("User is invalid", errors);
  }

}


module.exports = {
  getAll: getAll,
  getUser: getUser,
  createUser: createUser
};