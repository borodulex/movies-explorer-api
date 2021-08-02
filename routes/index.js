const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');

const {
  createUser,
  signin,
  signout,
} = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', signin);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signout);

module.exports = router;
