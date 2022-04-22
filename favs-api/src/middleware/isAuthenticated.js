const jwt = require('jsonwebtoken');

const getRequestToken = (req) => {
  const TOKEN_PREFIX = 'bearer ';
  const authorizationHeaderValue = req.get('authorization');

  if (
    authorizationHeaderValue &&
    authorizationHeaderValue.toLowerCase().startsWith(TOKEN_PREFIX)
  ) {
    return authorizationHeaderValue.substring(TOKEN_PREFIX.length);
  }
  return null;
};

const isAuthenticated = (req, res, next) => {
  try {
    const token = getRequestToken(req);
    if (!token) return res.status(401).json({ error: 'missing token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

module.exports = isAuthenticated;
