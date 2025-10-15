const db = require('../models');
const Order = db.Order;

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, {
      where: { order_id: req.params.id }
    });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const order = await Order.findByPk(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({
      where: { order_id: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ New: Update delivery status and ETA
exports.updateDelivery = async (req, res) => {
  try {
    const { delivery_status, estimated_delivery } = req.body;
    const [updated] = await Order.update(
      { delivery_status, estimated_delivery },
      { where: { order_id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const order = await Order.findByPk(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};