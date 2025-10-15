const express = require('express');
const router = express.Router();
const productController = require('../controllers/product_controller');
const upload = require('../middleware/uploadMiddleware'); // ⬅️ multer middleware

// Create a new product with image upload
router.post('/', upload.single('image'), productController.createProduct);

// Update a product with optional image upload
router.put('/:id', upload.single('image'), productController.updateProduct);

// Get a single product
router.get('/:id', productController.getProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;