const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItem_controller');

router.post('/', cartItemController.createCartItem);
router.get('/:id', cartItemController.getCartItem);
router.get('/', cartItemController.getAllCartItems);
router.put('/:id', cartItemController.updateCartItem);
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;