const { UNAUTHORIZED } = require('../utils/consts');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
