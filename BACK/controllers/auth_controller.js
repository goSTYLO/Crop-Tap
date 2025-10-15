const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, role are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      phone: phone || null,
      address: address || null
    });

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      created_at: user.created_at
    };

    return res.status(201).json({ message: 'Registration successful', user: safeUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '24h' }
    );

    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({ user: safeUser, accessToken: token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


