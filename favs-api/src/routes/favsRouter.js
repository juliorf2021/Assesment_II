const express = require('express');
const favsController = require('../controllers/favsController');
const isAuthenticated = require('../middleware/isAuthenticated');
const favsListValidator = require('../validators/favsListValidator');
const validateRequest = require('../middleware/validateRequest');
const favsItemValidator = require('../validators/favsItemValidator');

const favsRouter = express.Router();

favsRouter.get('/', isAuthenticated, favsController.getAllFavsLists);
favsRouter.post(
  '/',
  isAuthenticated,
  validateRequest(favsListValidator),
  favsController.createFavsList
);
favsRouter.get('/:id', isAuthenticated, favsController.getFavsListById);
favsRouter.delete('/:id', isAuthenticated, favsController.deleteFavsListById);
favsRouter.post(
  '/list/:id',
  isAuthenticated,
  validateRequest(favsItemValidator),
  favsController.addItemToFavsById
);

module.exports = favsRouter;
