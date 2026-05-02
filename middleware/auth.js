const logger = require('../config/logger');
const { AppError } = require('./errorHandler');

/**
 * Authentication middleware
 * Verifies user session and redirects to login if not authenticated
 */
const authenticate = (req, res, next) => {
  if (!req.session || !req.session.user) {
    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized. Please log in.',
    });
  }
  next();
};

/**
 * Authorization middleware factory
 * Checks if user has required role/permission
 */
const authorize = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
      });
    }

    const userRole = req.session.user.role;
    if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
      logger.warn(
        `Forbidden access attempt by ${req.session.user._id} to ${req.path}`
      );
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: 'Forbidden. You do not have permission to access this resource.',
      });
    }

    next();
  };
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  authenticate,
  authorize,
  asyncHandler,
};
