const router = require('express').Router();

const {
  getBio,
  updateBio,
} = require('../controllers/users');

router.get('/me', getBio);
router.patch('/me', updateBio);

module.exports = router;
