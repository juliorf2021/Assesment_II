const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  logger.error(err.message);
  return res.status(500).send({ error: 'server error' });
};

module.exports = errorHandler;
