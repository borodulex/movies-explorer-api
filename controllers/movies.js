const Movie = require('../models/movie');

const { CREATED } = require('../utils/consts');
const { parseValidationErrors } = require('../utils/utils');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports = {
  find(req, res, next) {
    Movie.find({ owner: req.user._id })
      .populate('owner')
      .then((movies) => res.send(movies))
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new BadRequestError('Ошибка приведения значения к ObjectId. Проверьте валидность передаваемого id.'));
        }
        return next(error);
      });
  },
  create(req, res, next) {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const owner = req.user._id;

    Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    })
      .then((movie) => movie.populate('owner').execPopulate())
      .then(((movie) => res.status(CREATED).send(movie)))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new BadRequestError(`Ошибка валидации данных movie: ${parseValidationErrors(error)}.`));
        }
        return next(error);
      });
  },
  remove(req, res, next) {
    const { movieId } = req.params;

    Movie.findById(movieId)
      .orFail(() => new NotFoundError('Фильм не найден.'))
      .then((movie) => {
        if (String(movie.owner) !== req.user._id) {
          throw new ForbiddenError('Невозможно удалить чужой фильм.');
        }
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send({ message: 'Фильм удален.' }));
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          next(new BadRequestError('Ошибка приведения значения к ObjectId. Проверьте валидность передаваемого id.'));
        }
        next(error);
      });
  },
};
