const router = require('express').Router();

const {
  getBio,
  updateBio,
} = require('../controllers/users');
const { validateUserBio } = require('../middlewares/validations');

router.get('/me', getBio);
router.patch('/me', validateUserBio, updateBio);

module.exports = router;
