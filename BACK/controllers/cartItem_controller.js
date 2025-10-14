const db = require('../models');
const CartItem = db.CartItem;

exports.createCartItem = async (req, res) => {
  try {
    const item = await CartItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCartItem = async (req, res) => {
  try {
    const item = await CartItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCartItems = async (req, res) => {
  try {
    const items = await CartItem.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const [updated] = await CartItem.update(req.body, {
      where: { cart_item_id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Cart item not found' });
    const item = await CartItem.findByPk(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const deleted = await CartItem.destroy({
      where: { cart_item_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};