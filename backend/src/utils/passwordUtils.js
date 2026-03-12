const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const logger = require('../utils/logger');

/**
 * Hashes a plain password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} The hashed password.
 */
exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error(`Error hashing password: ${error.message}`);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compares a plain password with a hashed password.
 * @param {string} plainPassword - The plain text password.
 * @param {string} hashedPassword - The hashed password from the database.
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
exports.comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    logger.error(`Error comparing passwords: ${error.message}`);
    throw new Error('Failed to compare passwords');
  }
};

/**
 * Generates a JWT token for a user.
 * @param {string} userId - The user's ID.
 * @param {string} userRole - The user's role.
 * @returns {string} The JWT token.
 */
exports.generateToken = (userId, userRole) => {
  return jwt.sign(
    { id: userId, role: userRole },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
};