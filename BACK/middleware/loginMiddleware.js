const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

const loginMiddleware = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    req.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};

module.exports = loginMiddleware;