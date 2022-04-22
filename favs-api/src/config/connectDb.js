const mongoose = require('mongoose');
const logger = require('./logger');
const { MONGO_URI } = require('./constants');

const connectDb = () => {
  try {
    mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to database');
  } catch (err) {
    logger.error(`Error connecting to db: ${err}`);
  }
};

module.exports = connectDb;
