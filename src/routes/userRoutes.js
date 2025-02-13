const express = require('express');
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');

const router = express.Router();

router.post('/register', (req, res, next) => {
  const errors = userValidator.validateRegistration(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}, userController.register);

module.exports = router;