const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/constants');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userWithSameEmail = await User.findOne({ email });
    if (userWithSameEmail)
      return res.status(400).json({ error: 'user with email already exists' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    logger.info(`Created user ${user.email}`);
    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'invalid username or password' });

    const passwordIsCorrect = await bcrypt.compare(password, user.passwordHash);
    if (!passwordIsCorrect)
      return res.status(400).json({ error: 'invalid username or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    logger.info(`Logged in user ${user.email}`);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.token.userId);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, getCurrentUser };
