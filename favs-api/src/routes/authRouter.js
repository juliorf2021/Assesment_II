const express = require('express');
const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/isAuthenticated');
const validateRequest = require('../middleware/validateRequest');
const authValidator = require('../validators/authValidator');

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateRequest(authValidator),
  authController.register
);
authRouter.post('/login', validateRequest(authValidator), authController.login);
authRouter.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = authRouter;
