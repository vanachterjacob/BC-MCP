const express = require('express');
const router = express.Router();
const rulesController = require('../controllers/rulesController');
const auth = require('../middleware/auth');

/**
 * @route GET /api/rules
 * @desc Get all rules
 * @access Public
 */
router.get('/', rulesController.getAllRules);

/**
 * @route GET /api/rules/:id
 * @desc Get rule by ID
 * @access Public
 */
router.get('/:id', rulesController.getRuleById);

/**
 * @route POST /api/rules
 * @desc Create a new rule
 * @access Private/Admin or Contributor
 */
router.post('/', auth.isAdmin, rulesController.createRule);

/**
 * @route PUT /api/rules/:id
 * @desc Update a rule
 * @access Private/Admin or Contributor
 */
router.put('/:id', auth.isAdmin, rulesController.updateRule);

/**
 * @route DELETE /api/rules/:id
 * @desc Delete a rule
 * @access Private/Admin
 */
router.delete('/:id', auth.isAdmin, rulesController.deleteRule);

module.exports = router; 