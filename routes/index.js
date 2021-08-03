const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/not-found-err');

const {
  createUser,
  signin,
  signout,
} = require('../controllers/users');
const {
  validateUserBody,
  validateCredentials,
} = require('../middlewares/validations');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateCredentials, signin);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signout);
router.use((req, res, next) => next(new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса.')));

module.exports = router;
