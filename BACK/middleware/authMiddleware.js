const jwt = require('jsonwebtoken');

// Verify JWT and attach payload to req.user
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || '';
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};

// Restrict based on roles
exports.authorize = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user || (allowed.length && !allowed.includes(req.user.role))) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
};


