const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order_controller');

router.post('/', orderController.createOrder);
router.get('/by-buyer/:buyer_id', orderController.getOrdersByBuyer);
router.get('/by-farmer/:farmer_id', orderController.getOrdersByFarmer);
router.get('/:id', orderController.getOrder);
router.get('/', orderController.getAllOrders);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
router.patch('/:id/delivery', orderController.updateDelivery);

module.exports = router;