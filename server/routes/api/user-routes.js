// Referencing code from Module 21
const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBrewery,
  deleteBrewery,
  login,
} = require('../../controllers/user-controller');

// import middleware
const { authMiddleware } = require('../../utils/auth');

// put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authMiddleware, saveBrewery);

router.route('/login').post(login);

router.route('/me').get(authMiddleware, getSingleUser);

router.route('/breweries/:breweryId').delete(authMiddleware, deleteBrewery);

module.exports = router;
