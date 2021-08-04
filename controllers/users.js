const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { CREATED } = require('../utils/consts');
const { parseValidationErrors } = require('../utils/utils');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const { JWT_SECRET } = require('../config');

module.exports = {
  createUser(req, res, next) {
    const {
      email,
      password,
      name,
    } = req.body;

    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email,
        password: hash,
        name,
      }))
      .then((createdUser) => res.status(CREATED).send({
        name: createdUser.name,
        email: createdUser.email,
      }))
      .catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        }
        if (error.name === 'ValidationError') {
          return next(new BadRequestError(`Ошибка валидации данных user: ${parseValidationErrors(error)}`));
        }
        return next(error);
      });
  },
  signin(req, res, next) {
    const {
      email,
      password,
    } = req.body;

    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: '7d' },
        );

        res.cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        return res.send({ messsage: 'Все верно!' });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new BadRequestError(`Ошибка валидации данных user: ${parseValidationErrors(error)}`));
        }
        return next(error);
      });
  },
  signout(req, res) {
    res.clearCookie('token');
    return res.send({ message: 'Успешный выход из системы.' });
  },
  getBio(req, res, next) {
    User.findById(req.user._id)
      .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден.'))
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new BadRequestError('Ошибка приведения значения к ObjectId. Проверьте валидность передаваемого id.'));
        }
        return next(error);
      });
  },
  updateBio(req, res, next) {
    User.findByIdAndUpdate(
      req.user._id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => new NotFoundError('Запрашиваемый пользователь не найден.'))
      .then((user) => res.send(user))
      .catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
        }
        if (error.name === 'CastError') {
          return next(new BadRequestError('Ошибка приведения значения к ObjectId. Проверьте валидность передаваемого id.'));
        }
        if (error.name === 'ValidationError') {
          return next(new BadRequestError(`Ошибка валидации данных movie: ${parseValidationErrors(error)}`));
        }
        return next(error);
      });
  },
};
