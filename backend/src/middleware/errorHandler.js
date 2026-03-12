const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';

  // Specific error handling for Joi validation errors
  if (err.isJoi) {
    statusCode = 400; // Bad Request
    message = err.details.map(detail => detail.message).join(', ');
    logger.warn(`Validation Error for ${req.method} ${req.originalUrl}: ${message}`);
  } else {
    // Log unexpected errors
    if (statusCode === 500) {
      logger.error(`Server Error for ${req.method} ${req.originalUrl}: ${err.message}`, err.stack);
    } else {
      logger.warn(`Client Error (${statusCode}) for ${req.method} ${req.originalUrl}: ${err.message}`);
    }
  }

  // Prevent sending sensitive error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An internal server error occurred.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Optional: send stack in dev
  });
}

module.exports = errorHandler;