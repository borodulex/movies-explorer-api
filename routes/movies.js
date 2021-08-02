const router = require('express').Router();

const {
  find,
  create,
  remove,
} = require('../controllers/movies');

router.get('/', find);
router.post('/', create);
router.delete('/:movieId', remove);

module.exports = router;
