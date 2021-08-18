const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Значение \'email\' обязательно'],
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Сбой валидатора для значения \'email\'. Ожидалась строка в формате email, а получено \'{VALUE}\'',
    },
  },
  password: {
    type: String,
    required: [true, 'Значение \'password\' обязательно'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Значение \'name\' обязательно'],
    minLength: [2, 'Значение \'name\' не может быть меньше 2, получено \'{VALUE}\''],
    maxLength: [30, 'Значение \'name\' не может быть больше 30, получено \'{VALUE}\''],
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
