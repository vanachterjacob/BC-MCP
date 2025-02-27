const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const auth = require('../middleware/auth');

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private/Admin
 */
router.get('/', auth.isAdmin, usersController.getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private/Owner or Admin
 */
router.get('/:id', auth.isOwnerOrAdmin, usersController.getUserById);

/**
 * @route POST /api/users
 * @desc Register a new user
 * @access Public
 */
router.post('/', usersController.createUser);

/**
 * @route POST /api/users/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', usersController.loginUser);

/**
 * @route PUT /api/users/:id
 * @desc Update a user
 * @access Private/Owner or Admin
 */
router.put('/:id', auth.isOwnerOrAdmin, usersController.updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Delete a user
 * @access Private/Admin
 */
router.delete('/:id', auth.isAdmin, usersController.deleteUser);

module.exports = router; 