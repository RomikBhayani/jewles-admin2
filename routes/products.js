const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, asyncHandler } = require('../middleware/auth');
const { validators, handleValidationErrors } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// ============================================================================
// PRODUCT ROUTES
// ============================================================================

// Create product with variants
router.post(
  '/',
  validators.product,
  handleValidationErrors,
  asyncHandler((req, res, next) => productController.createProduct(req, res, next))
);

// Get all products
router.get(
  '/',
  asyncHandler((req, res, next) => productController.getProducts(req, res, next))
);

// Get product with variants
router.get(
  '/:id',
  asyncHandler((req, res, next) => productController.getProductWithVariants(req, res, next))
);

// Update product
router.put(
  '/:id',
  asyncHandler((req, res, next) => productController.updateProduct(req, res, next))
);

// Delete product
router.delete(
  '/:id',
  asyncHandler((req, res, next) => productController.deleteProduct(req, res, next))
);

module.exports = router;
