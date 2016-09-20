const Promise = require("bluebird");
const bcrypt = require('bcrypt');
const UserNotFoundError = require("../errors/user_not_found_error");
const UserValidationError = require("../errors/user_validation_error");

function hashPassword(plainText) {
  return new Promise(function(resolve, reject) {
    bcrypt.hash(plainText, 5, function(err, hash) {
      if (err) { console.log(err); return reject(err); }
      resolve(hash);
    });
  });
}

module.exports = {
  hashPassword: hashPassword
}
