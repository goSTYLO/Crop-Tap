const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// Create a new user
router.post('/', userController.createUser);

// User login
router.post('/login', userController.loginUser);

// Get a single user by ID
router.get('/:id', userController.getUser);

// Get all users
router.get('/', userController.getAllUsers);

// Update a user by ID
router.put('/:id', userController.updateUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;