const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart_controller');

router.post('/', cartController.createCart);
router.get('/by-buyer/:buyer_id', cartController.getCartsByBuyer);
router.get('/:id', cartController.getCart);
router.get('/', cartController.getAllCarts);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;