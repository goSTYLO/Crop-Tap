const db = require('../models');
const User = db.User;
const loginMiddleware = require('../middleware/loginMiddleware');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { user_id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'User not found' });
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ New: Login endpoint
exports.loginUser = async (req, res, next) => {
  try {
    await loginMiddleware(req, res, () => {
      res.json({ user: req.user });
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};