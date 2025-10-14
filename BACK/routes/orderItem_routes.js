const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItem_controller');

router.post('/', orderItemController.createOrderItem);
router.get('/:id', orderItemController.getOrderItem);
router.get('/', orderItemController.getAllOrderItems);
router.put('/:id', orderItemController.updateOrderItem);
router.delete('/:id', orderItemController.deleteOrderItem);

module.exports = router;