const express = require('express');
const router = express.Router();
const customRequestController = require('../controllers/customRequestController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateCustomRequest, validateCustomRequestUpdate } = require('../middleware/validationMiddleware');

router.post('/', validateCustomRequest, customRequestController.createCustomRequest);

// Admin-only routes for managing requests
router.get('/', authenticateToken, authorizeRoles('admin'), customRequestController.getAllCustomRequests);
router.get('/:id', authenticateToken, authorizeRoles('admin'), customRequestController.getCustomRequestById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateCustomRequestUpdate, customRequestController.updateCustomRequest);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), customRequestController.deleteCustomRequest);

module.exports = router;