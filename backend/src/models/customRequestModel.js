const { pool } = require('../config/db');
const logger = require('../utils/logger');

class CustomRequest {
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM custom_requests ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      logger.error(`Error in CustomRequest.findAll: ${error.message}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM custom_requests WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in CustomRequest.findById (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async create(name, phone_number, jewellery_type, expected_weight, design_image_url, message) {
    try {
      const [result] = await pool.query(
        'INSERT INTO custom_requests (name, phone_number, jewellery_type, expected_weight, design_image_url, message) VALUES (?, ?, ?, ?, ?, ?)',
        [name, phone_number, jewellery_type, expected_weight, design_image_url, message]
      );
      return { id: result.insertId, name, phone_number, jewellery_type, expected_weight, design_image_url, message, status: 'Pending' };
    } catch (error) {
      logger.error(`Error in CustomRequest.create (Name: ${name}): ${error.message}`);
      throw error;
    }
  }

  static async update(id, name, phone_number, jewellery_type, expected_weight, design_image_url, message, status) {
    try {
      const [result] = await pool.query(
        'UPDATE custom_requests SET name = ?, phone_number = ?, jewellery_type = ?, expected_weight = ?, design_image_url = ?, message = ?, status = ? WHERE id = ?',
        [name, phone_number, jewellery_type, expected_weight, design_image_url, message, status, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, name, phone_number, jewellery_type, expected_weight, design_image_url, message, status };
    } catch (error) {
      logger.error(`Error in CustomRequest.update (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM custom_requests WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in CustomRequest.delete (ID: ${id}): ${error.message}`);
      throw error;
    }
  }
}

module.exports = CustomRequest;