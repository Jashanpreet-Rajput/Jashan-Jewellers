const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class User {
  static async findByUsername(username) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in User.findByUsername (Username: ${username}): ${error.message}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in User.findById (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async create(username, password, role = 'user') {
    try {
      const password_hash = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [username, password_hash, role]
      );
      return { id: result.insertId, username, role };
    } catch (error) {
      logger.error(`Error in User.create (Username: ${username}): ${error.message}`);
      throw error;
    }
  }
}

module.exports = User;