const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    const payload = jwt.verify(cookie, process.env.JWT_SECRET);
    console.log('payload', payload);
    req.user = payload;
    next();
  } catch (error) {
    error.message = 'Must be signed in to continue.';
    error.status = 401;
    next(error);
  }
};
