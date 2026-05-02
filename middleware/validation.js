const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

/**
 * Validation error handler middleware
 * Processes validation results and returns errors if any
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error on ${req.path}:`, errors.array());
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Validation Error',
      errors: errors.array().reduce((acc, err) => {
        acc[err.param] = err.msg;
        return acc;
      }, {}),
    });
  }
  next();
};

/**
 * Common validation chains
 */
const validators = {
  // Metal rate validation
  metalRate: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Metal name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Metal name must be between 2 and 50 characters'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Metal code is required')
      .isLength({ max: 10 })
      .withMessage('Metal code must not exceed 10 characters')
      .matches(/^[A-Z0-9]+$/, 'i')
      .withMessage('Metal code must be alphanumeric'),
    body('ratePerGram')
      .notEmpty()
      .withMessage('Rate per gram is required')
      .isFloat({ min: 0 })
      .withMessage('Rate must be a positive number'),
  ],

  // Diamond rate validation
  diamondRate: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Diamond type name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Diamond type name must be between 2 and 50 characters'),
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Diamond code is required')
      .isLength({ max: 10 })
      .withMessage('Diamond code must not exceed 10 characters')
      .matches(/^[A-Z0-9]+$/, 'i')
      .withMessage('Diamond code must be alphanumeric'),
    body('ratePerPiece')
      .notEmpty()
      .withMessage('Rate per piece is required')
      .isFloat({ min: 0 })
      .withMessage('Rate must be a positive number'),
  ],

  // Product validation
  product: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 3, max: 200 })
      .withMessage('Product name must be between 3 and 200 characters'),
    body('sku')
      .trim()
      .notEmpty()
      .withMessage('SKU is required')
      .matches(/^[A-Z0-9-]+$/, 'i')
      .withMessage('SKU must be alphanumeric'),
    body('category')
      .notEmpty()
      .withMessage('Category is required')
      .isIn(['ring', 'necklace', 'bracelet', 'earring', 'pendant', 'other'])
      .withMessage('Invalid category'),
    body('material.weightGrams')
      .notEmpty()
      .withMessage('Weight is required')
      .isFloat({ min: 0.1 })
      .withMessage('Weight must be greater than 0'),
    body('material.diamondCount')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Diamond count must be a non-negative integer'),
  ],
};

module.exports = {
  handleValidationErrors,
  validators,
};
