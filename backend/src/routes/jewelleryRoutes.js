const express = require('express');
const router = express.Router();
const jewelleryController = require('../controllers/jewelleryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { validateJewellery } = require('../middleware/validationMiddleware');

router.get('/', jewelleryController.getAllJewellery);
router.get('/:id', jewelleryController.getJewelleryById);

// Admin-only routes
router.post('/', authenticateToken, authorizeRoles('admin'), validateJewellery, jewelleryController.createJewellery);
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateJewellery, jewelleryController.updateJewellery);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), jewelleryController.deleteJewellery);

module.exports = router;