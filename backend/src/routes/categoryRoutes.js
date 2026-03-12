const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateCategory } = require('../middleware/validationMiddleware');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin-only routes
router.post('/', authenticateToken, authorizeRoles('admin'), validateCategory, categoryController.createCategory);
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateCategory, categoryController.updateCategory);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), categoryController.deleteCategory);

module.exports = router;