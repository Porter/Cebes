function UserNotFoundError(message) {
  this.name = 'UserNotFoundError';
  this.message = message || 'User not found';
  this.stack = (new Error()).stack;
}
UserNotFoundError.prototype = Object.create(Error.prototype);
UserNotFoundError.prototype.constructor = UserNotFoundError;

module.exports = UserNotFoundError;