const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const logger = require('../utils/logger');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    logger.warn('Authentication attempt without token');
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      logger.warn(`Invalid token: ${err.message}`);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // { id: userId, role: userRole }
    next();
  });
};

exports.authorizeRoles = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      logger.warn('Authorization denied: User or role not found in request');
      return res.status(401).json({ message: 'Not authorized to access this resource: Role missing' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      logger.warn(`Authorization denied for user ID ${req.user.id} with role ${req.user.role}. Required roles: ${roles.join(', ')}`);
      return res.status(403).json({ message: 'Not authorized to access this resource: Insufficient permissions' });
    }
    next();
  };
};