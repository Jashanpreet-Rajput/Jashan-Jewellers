const { pool } = require('../config/db');
const logger = require('../utils/logger');

class Category {
  static async findAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
      return rows;
    } catch (error) {
      logger.error(`Error in Category.findAll: ${error.message}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in Category.findById (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async create(name, icon_url) {
    try {
      const [result] = await pool.query(
        'INSERT INTO categories (name, icon_url) VALUES (?, ?)',
        [name, icon_url]
      );
      return { id: result.insertId, name, icon_url };
    } catch (error) {
      logger.error(`Error in Category.create (Name: ${name}): ${error.message}`);
      throw error;
    }
  }

  static async update(id, name, icon_url) {
    try {
      const [result] = await pool.query(
        'UPDATE categories SET name = ?, icon_url = ? WHERE id = ?',
        [name, icon_url, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, name, icon_url };
    } catch (error) {
      logger.error(`Error in Category.update (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in Category.delete (ID: ${id}): ${error.message}`);
      throw error;
    }
  }
}

module.exports = Category;