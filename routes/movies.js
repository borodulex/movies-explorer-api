const router = require('express').Router();

const {
  find,
  create,
  remove,
} = require('../controllers/movies');
const {
  validateMovieBody,
  validateMovieId,
} = require('../middlewares/validations');

router.get('/', find);
router.post('/', validateMovieBody, create);
router.delete('/:movieId', validateMovieId, remove);

module.exports = router;
