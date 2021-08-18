const { Types } = require('mongoose');
const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Значение \'email\' должно быть строкой в формате email')
      .messages({
        'any.required': 'Значение \'email\' обязательно',
      }),
    password: Joi.string().min(8).required()
      .messages({
        'string.min': 'Минимальная длина значения \'password\' - 8',
        'any.required': 'Значение \'password\' обязательно',
      }),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина значения \'name\' - 2',
        'string.max': 'Максимальная длина значения \'name\' - 30',
        'any.required': 'Значение \'name\' обязательно',
      }),
  }),
});

const validateCredentials = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Значение \'email\' должно быть строкой в формате email')
      .messages({
        'any.required': 'Значение \'email\' обязательно',
      }),
    password: Joi.string().min(8).required()
      .messages({
        'string.min': 'Минимальная длина значения \'password\' - 8',
        'any.required': 'Значение \'password\' обязательно',
      }),
  }),
});

const validateUserBio = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message('Значение \'email\' должно быть строкой в формате email'),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Минимальная длина значения \'name\' - 2',
        'string.max': 'Максимальная длина значения \'name\' - 30',
        'any.required': 'Значение \'name\' обязательно',
      }),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': 'Значение \'country\' обязательно',
      }),
    director: Joi.string().required()
      .messages({
        'any.required': 'Значение \'director\' обязательно',
      }),
    duration: Joi.number().required()
      .messages({
        'any.required': 'Значение \'duration\' обязательно',
      }),
    year: Joi.string().required()
      .messages({
        'any.required': 'Значение \'year\' обязательно',
      }),
    description: Joi.string().required()
      .messages({
        'any.required': 'Значение \'description\' обязательно',
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Значение \'image\' должно быть строкой в формате URL');
    })
      .messages({
        'any.required': 'Значение \'image\' обязательно',
      }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Значение \'trailer\' должно быть строкой в формате URL');
    })
      .messages({
        'any.required': 'Значение \'trailer\' обязательно',
      }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Значение \'thumbnail\' должно быть строкой в формате URL');
    })
      .messages({
        'any.required': 'Значение \'thumbnail\' обязательно',
      }),
    movieId: Joi.number().required().custom((value, helpers) => {
      if (validator.isInt(String(value))) {
        return value;
      }
      return helpers.message('Значение \'movieId\' должно быть целым числом');
    })
      .messages({
        'any.required': 'Значение \'movieId\' обязательно',
      }),
    nameRU: Joi.string().required()
      .messages({
        'any.required': 'Значение \'nameRU\' обязательно',
      }),
    nameEN: Joi.string().required()
      .messages({
        'any.required': 'Значение \'nameEN\' обязательно',
      }),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().custom((value, helpers) => {
      if (Types.ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id фильма');
    })
      .messages({
        'any.required': 'Значение \'movieId\' обязательно',
      }),
  }),
});

module.exports = {
  validateUserBody,
  validateCredentials,
  validateUserBio,
  validateMovieBody,
  validateMovieId,
};
