const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Значение \'country\' обязательно'],
  },
  director: {
    type: String,
    required: [true, 'Значение \'director\' обязательно'],
  },
  duration: {
    type: Number,
    required: [true, 'Значение \'duration\' обязательно'],
  },
  year: {
    type: String,
    required: [true, 'Значение \'year\' обязательно'],
  },
  description: {
    type: String,
    required: [true, 'Значение \'description\' обязательно'],
  },
  image: {
    type: String,
    required: [true, 'Значение \'image\' обязательно'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Сбой валидатора для значения \'image\'. Ожидалась строка в формате URL, а получено \'{VALUE}\'',
    },
  },
  trailer: {
    type: String,
    required: [true, 'Значение \'trailer\' обязательно'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Сбой валидатора для значения \'trailer\'. Ожидалась строка в формате URL, а получено \'{VALUE}\'',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Значение \'thumbnail\' обязательно'],
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Сбой валидатора для значения \'thumbnail\'. Ожидалась строка в формате URL, а получено \'{VALUE}\'',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Значение \'owner\' обязательно'],
    validate: {
      validator(v) {
        return mongoose.Types.ObjectId.isValid(v);
      },
      message: 'Пользователя с Id \'{VALUE}\' не существует',
    },
  },
  movieId: {
    type: Number,
    required: [true, 'Значение \'movieId\' обязательно'],
    validate: {
      validator(v) {
        return validator.isInt(String(v));
      },
      message: 'Сбой валидатора для значения \'movieId\'. Ожидалось целое число, а получено \'{VALUE}\'',
    },
  },
  nameRU: {
    type: String,
    required: [true, 'Значение \'nameRU\' обязательно'],
  },
  nameEN: {
    type: String,
    required: [true, 'Значение \'nameEN\' обязательно'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
