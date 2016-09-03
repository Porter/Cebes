function UserValidationError(message, validationErrors) {
  this.name = 'UserValidationError';
  this.message = message || 'User not valid';
  this.validationErrors = validationErrors || [];
  this.stack = (new Error()).stack;
}
UserValidationError.prototype = Object.create(Error.prototype);
UserValidationError.prototype.constructor = UserValidationError;

module.exports = UserValidationError;