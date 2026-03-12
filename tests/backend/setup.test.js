// This file can be used for global setup/teardown if needed,
// but for now, individual test files handle their own cleanup.

// Example: Initialize a test database connection if needed
// const { pool } = require('../../backend/src/config/db');
//
// before(async () => {
//   // Connect to test database or migrate
//   console.log('Global setup: Initializing test database...');
//   // await pool.query('CREATE DATABASE IF NOT EXISTS test_jashan_jewellers;');
//   // await pool.query('USE test_jashan_jewellers;');
//   // ... run schema.sql for test db ...
// });
//
// after(async () => {
//   console.log('Global teardown: Cleaning up test database...');
//   // await pool.query('DROP DATABASE IF EXISTS test_jashan_jewellers;');
//   pool.end(); // Close the connection pool
// });

// Note: For actual CI/CD or more complex testing, consider using a separate
// test database (e.g., `jashan_jewellers_test`) and running migrations on it
// before tests, and tearing it down after. The current setup modifies the
// main `jashan_jewellers` db, which is acceptable for simple local dev testing
// but not ideal for robust production CI.