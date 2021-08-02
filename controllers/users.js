const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { CREATED } = require('../utils/consts');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

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
          return next(new BadRequestError('Ошибка валидации данных user. Проверьте корректность передаваемых значений.'));
        }
        return next(error);
      });
  },
  getBio(req, res, next) {
    User.findById(req.user._id)
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Запрашиваемый пользователь не найден.');
        }
        return res.send(user);
      })
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
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Запрашиваемый пользователь не найден.');
        }
        return res.send(user);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new BadRequestError('Ошибка приведения значения к ObjectId. Проверьте валидность передаваемого id.'));
        }
        if (error.name === 'ValidationError') {
          return next(new BadRequestError('Ошибка валидации данных user. Проверьте корректность передаваемых значений.'));
        }
        return next(error);
      });
  },
};
