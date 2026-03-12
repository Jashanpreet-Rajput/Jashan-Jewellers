const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    logger.info('Database connection established.');
    connection.release(); // Release the connection immediately after a successful test
    return pool; // Return the pool for use in models
  } catch (error) {
    logger.error('Error connecting to the database:', error.message);
    throw error;
  }
}

module.exports = {
  getConnection,
  pool
};