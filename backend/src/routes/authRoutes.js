const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser } = require('../middleware/validationMiddleware');

// Admin registration route (should be protected or removed after initial setup)
router.post('/register', validateUser, authController.register); // For initial admin creation, secure or remove after
router.post('/login', validateUser, authController.login);

module.exports = router;