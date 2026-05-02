const express = require('express');
const router = express.Router();
const metalRateController = require('../controllers/metalRateController');
const diamondRateController = require('../controllers/diamondRateController');
const { authenticate, asyncHandler } = require('../middleware/auth');
const { validators, handleValidationErrors } = require('../middleware/validation');

// Apply authentication middleware to all routes
router.use(authenticate);

// ============================================================================
// METAL RATES ROUTES
// ============================================================================

// Create metal rate
router.post(
  '/metals',
  validators.metalRate,
  handleValidationErrors,
  asyncHandler((req, res, next) => metalRateController.createMetalRate(req, res, next))
);

// Get all metal rates
router.get(
  '/metals',
  asyncHandler((req, res, next) => metalRateController.getMetalRates(req, res, next))
);

// Get active metals
router.get(
  '/metals/active',
  asyncHandler((req, res, next) => metalRateController.getActiveMetals(req, res, next))
);

// Get single metal rate
router.get(
  '/metals/:id',
  asyncHandler((req, res, next) => metalRateController.getMetalRateById(req, res, next))
);

// Update metal rate
router.put(
  '/metals/:id',
  validators.metalRate,
  handleValidationErrors,
  asyncHandler((req, res, next) => metalRateController.updateMetalRate(req, res, next))
);

// Delete metal rate
router.delete(
  '/metals/:id',
  asyncHandler((req, res, next) => metalRateController.deleteMetalRate(req, res, next))
);

// Bulk update metal rates
router.patch(
  '/metals/bulk-update',
  asyncHandler((req, res, next) => metalRateController.bulkUpdateMetalRates(req, res, next))
);

// ============================================================================
// DIAMOND RATES ROUTES
// ============================================================================

// Create diamond rate
router.post(
  '/diamonds',
  validators.diamondRate,
  handleValidationErrors,
  asyncHandler((req, res, next) => diamondRateController.createDiamondRate(req, res, next))
);

// Get all diamond rates
router.get(
  '/diamonds',
  asyncHandler((req, res, next) => diamondRateController.getDiamondRates(req, res, next))
);

// Get active diamonds
router.get(
  '/diamonds/active',
  asyncHandler((req, res, next) => diamondRateController.getActiveDiamonds(req, res, next))
);

// Get diamonds by category
router.get(
  '/diamonds/by-category',
  asyncHandler((req, res, next) => diamondRateController.getDiamondsByCategory(req, res, next))
);

// Get single diamond rate
router.get(
  '/diamonds/:id',
  asyncHandler((req, res, next) => diamondRateController.getDiamondRateById(req, res, next))
);

// Update diamond rate
router.put(
  '/diamonds/:id',
  validators.diamondRate,
  handleValidationErrors,
  asyncHandler((req, res, next) => diamondRateController.updateDiamondRate(req, res, next))
);

// Delete diamond rate
router.delete(
  '/diamonds/:id',
  asyncHandler((req, res, next) => diamondRateController.deleteDiamondRate(req, res, next))
);

// Bulk update diamond rates
router.patch(
  '/diamonds/bulk-update',
  asyncHandler((req, res, next) => diamondRateController.bulkUpdateDiamondRates(req, res, next))
);

module.exports = router;
