require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const jewelleryRoutes = require('./routes/jewelleryRoutes');
const customRequestRoutes = require('./routes/customRequestRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MySQL
db.getConnection()
  .then(() => {
    logger.info('Successfully connected to MySQL database');
  })
  .catch((err) => {
    logger.error('Failed to connect to MySQL database:', err);
    process.exit(1); // Exit process if DB connection fails
  });

// Security Middleware
app.use(helmet());

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] 
    : ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000', 'file://'], // Allow local frontend during development
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Request logging
app.use(morgan('dev')); // 'dev' for concise output colored by response status

// JSON body parser
app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// Serve static files for the frontend (when deployed together)
// In development, the frontend is usually served separately (e.g., by live-server or a development server)
app.use(express.static('frontend/src')); // Assuming frontend/src is relative to the project root

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jewellery', jewelleryRoutes);
app.use('/api/custom-requests', customRequestRoutes);

// Root endpoint for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Jashan Jewellers API is running!' });
});

// Catch-all for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app; // Export app for testing