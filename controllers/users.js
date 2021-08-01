const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports = {
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
          next(new BadRequestError('Ошибка преобразования. Проверьте валидность передаваемого id.'));
        }
        next(error);
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
          next(new BadRequestError('Ошибка преобразования. Проверьте валидность передаваемого id.'));
        }
        if (error.name === 'ValidationError') {
          next(new BadRequestError('Ошибка валидации данных user. Проверьте корректность передаваемых значений.'));
        }
        next(error);
      });
  },
};
