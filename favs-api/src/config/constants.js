require('dotenv').config();

const PORT = process.env.PORT || 3000;

const IS_PROD = process.env.NODE_ENV === 'production';

const MONGO_URI =
  // eslint-disable-next-line no-nested-ternary
  IS_PROD
    ? process.env.MONGO_URI_PROD
    : process.env.NODE_ENV === 'test'
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI_DEV;

const { JWT_SECRET } = process.env;

module.exports = { PORT, MONGO_URI, IS_PROD, JWT_SECRET };
