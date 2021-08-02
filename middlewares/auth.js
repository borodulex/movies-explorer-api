const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new UnauthorizedError('Некорректный токен. Проверьте валидность передаваемого токена.');
    }
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
