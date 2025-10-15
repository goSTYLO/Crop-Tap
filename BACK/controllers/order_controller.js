const db = require('../models');
const Order = db.Order;
const businessService = require('../services/businessService');

exports.createOrder = async (req, res) => {
  try {
    const { cart_id, shipping_address } = req.body;

    if (!cart_id || !shipping_address) {
      return res.status(400).json({ error: 'cart_id and shipping_address are required' });
    }

    const order = await businessService.createOrderFromCart(cart_id, shipping_address);

    // ✅ Clear cart after successful order
    await businessService.clearCart(cart_id);

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

exports.getOrdersByBuyer = async (req, res) => {
  try {
    const buyer_id = req.params.buyer_id;

    const orders = await Order.findAll({
      where: { buyer_id },
      include: [db.OrderItem]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this buyer' });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByFarmer = async (req, res) => {
  try {
    const farmer_id = req.params.farmer_id;

    const orders = await Order.findAll({
      where: { farmer_id },
      include: [db.OrderItem]
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this farmer' });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};