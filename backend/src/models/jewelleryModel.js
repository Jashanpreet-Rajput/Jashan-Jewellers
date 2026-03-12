const { pool } = require('../config/db');
const logger = require('../utils/logger');

class Jewellery {
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        j.*, 
        c.name AS category_name, 
        c.icon_url AS category_icon_url 
      FROM jewellery j 
      JOIN categories c ON j.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (filters.category) {
      query += ' AND c.name = ?';
      params.push(filters.category);
    }
    if (filters.metal_type) {
      query += ' AND j.metal_type = ?';
      params.push(filters.metal_type);
    }
    if (filters.occasion) {
      query += ' AND j.occasion = ?';
      params.push(filters.occasion);
    }
    if (filters.is_trending) {
      query += ' AND j.is_trending = 1';
    }
    if (filters.is_bridal) {
      query += ' AND j.is_bridal = 1';
    }
    if (filters.is_lightweight) {
      query += ' AND j.is_lightweight = 1';
    }
    if (filters.search) {
      query += ' AND (j.name LIKE ? OR j.design_code LIKE ? OR j.description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    if (filters.weight_range) {
      switch (filters.weight_range) {
        case 'Under 5 grams':
          query += ' AND (j.expected_weight_max IS NULL OR j.expected_weight_max < 5)';
          break;
        case '5-10 grams':
          query += ' AND j.expected_weight_min >= 5 AND (j.expected_weight_max IS NULL OR j.expected_weight_max < 10)';
          break;
        case '10-20 grams':
          query += ' AND j.expected_weight_min >= 10 AND (j.expected_weight_max IS NULL OR j.expected_weight_max < 20)';
          break;
        case '20-40 grams':
          query += ' AND j.expected_weight_min >= 20 AND (j.expected_weight_max IS NULL OR j.expected_weight_max < 40)';
          break;
        case '40+ grams':
          query += ' AND j.expected_weight_min >= 40';
          break;
        default:
          // No specific weight filter
          break;
      }
    }

    query += ' ORDER BY j.created_at DESC';

    // Pagination
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }
    if (filters.offset) {
      query += ' OFFSET ?';
      params.push(filters.offset);
    }

    try {
      const [rows] = await pool.query(query, params);
      return rows;
    } catch (error) {
      logger.error(`Error in Jewellery.findAll: ${error.message}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query(`
        SELECT 
          j.*, 
          c.name AS category_name, 
          c.icon_url AS category_icon_url 
        FROM jewellery j 
        JOIN categories c ON j.category_id = c.id 
        WHERE j.id = ?
      `, [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in Jewellery.findById (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async create(
    design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
    image_url, category_id, occasion, is_trending, is_bridal, is_lightweight
  ) {
    try {
      const [result] = await pool.query(
        `INSERT INTO jewellery (design_code, name, description, metal_type, expected_weight_min, expected_weight_max, image_url, category_id, occasion, is_trending, is_bridal, is_lightweight) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
          image_url, category_id, occasion, is_trending, is_bridal, is_lightweight]
      );
      return { id: result.insertId, design_code, name, metal_type };
    } catch (error) {
      logger.error(`Error in Jewellery.create (Design Code: ${design_code}): ${error.message}`);
      throw error;
    }
  }

  static async update(
    id, design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
    image_url, category_id, occasion, is_trending, is_bridal, is_lightweight
  ) {
    try {
      const [result] = await pool.query(
        `UPDATE jewellery SET design_code = ?, name = ?, description = ?, metal_type = ?, expected_weight_min = ?, expected_weight_max = ?, image_url = ?, category_id = ?, occasion = ?, is_trending = ?, is_bridal = ?, is_lightweight = ?
         WHERE id = ?`,
        [design_code, name, description, metal_type, expected_weight_min, expected_weight_max,
          image_url, category_id, occasion, is_trending, is_bridal, is_lightweight, id]
      );
      if (result.affectedRows === 0) return null;
      return { id, design_code, name, metal_type };
    } catch (error) {
      logger.error(`Error in Jewellery.update (ID: ${id}): ${error.message}`);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM jewellery WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in Jewellery.delete (ID: ${id}): ${error.message}`);
      throw error;
    }
  }
}

module.exports = Jewellery;