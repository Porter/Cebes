function DBError(message, result) {
  this.name = 'DBError';
  this.message = message || 'User not valid';
  this.message += "\n" + JSON.stringify(result, null, 4);
  this.stack = (new Error()).stack;
}
DBError.prototype = Object.create(Error.prototype);
DBError.prototype.constructor = DBError;

module.exports = DBError;
