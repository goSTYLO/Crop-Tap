const db = require('../models');
const Cart = db.Cart;
const businessService = require('../services/businessService');

exports.createCart = async (req, res) => {
  try {
    const { buyer_id, cart_items } = req.body;

    if (!buyer_id || !Array.isArray(cart_items) || cart_items.length === 0) {
      return res.status(400).json({ error: 'buyer_id and cart_items[] are required' });
    }

    let cart = null;

    for (const item of cart_items) {
      const { product_id, quantity } = item;
      if (!product_id) continue;

      // Pass existing cart_id to reuse the same cart
      cart = await businessService.addToCart(buyer_id, product_id, quantity || 1, cart?.cart_id);
    }

    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const [updated] = await Cart.update(req.body, {
      where: { cart_id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Cart not found' });
    const cart = await Cart.findByPk(req.params.id);
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const deleted = await Cart.destroy({
      where: { cart_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Cart not found' });
    res.json({ message: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};