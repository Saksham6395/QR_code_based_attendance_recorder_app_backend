// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ success: false, message: 'No authorization header' });
  }

  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Invalid auth format' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = {
  authRequired
};
