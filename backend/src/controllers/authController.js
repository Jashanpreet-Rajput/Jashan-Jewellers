const User = require('../models/userModel');
const { generateToken } = require('../utils/passwordUtils'); // Renamed to passwordUtils
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Admin registration (consider removing or securing heavily in production)
exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let user = await User.findByUsername(username);
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    user = await User.create(username, password, 'admin'); // Default role 'admin'
    res.status(201).json({ message: 'Admin user registered successfully', userId: user.id });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);

    if (!user) {
      logger.warn(`Login attempt with non-existent username: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      logger.warn(`Login attempt with incorrect password for user: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error during login for user ${req.body.username}: ${error.message}`);
    next(error);
  }
};