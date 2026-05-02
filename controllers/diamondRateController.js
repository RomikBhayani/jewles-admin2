const diamondRateService = require('../services/diamondRateService');
const priceCalculationService = require('../services/priceCalculationService');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Diamond Rate Controller
 * Handles all HTTP requests related to diamond rates
 */

class DiamondRateController {
  /**
   * POST /api/rates/diamonds
   * Create a new diamond rate
   */
  async createDiamondRate(req, res, next) {
    try {
      const { name, code, ratePerPiece, currency, category, description, color, icon } = req.body;

      const diamondRate = await diamondRateService.createDiamondRate(
        { name, code, ratePerPiece, currency, category, description, color, icon },
        req.session.user._id
      );

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Diamond rate created successfully',
        data: diamondRate,
      });
    } catch (error) {
      logger.error(`Create diamond rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/diamonds
   * Get all diamond rates with pagination and filters
   */
  async getDiamondRates(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '', isActive = true, sortBy = 'name', sortOrder = 'asc' } = req.query;

      const result = await diamondRateService.getAllDiamondRates({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        isActive: isActive === 'true' || isActive === true,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Diamond rates retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error(`Get diamond rates error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/diamonds/:id
   * Get a single diamond rate by ID
   */
  async getDiamondRateById(req, res, next) {
    try {
      const { id } = req.params;
      const diamondRate = await diamondRateService.getDiamondRateById(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Diamond rate retrieved successfully',
        data: diamondRate,
      });
    } catch (error) {
      logger.error(`Get diamond rate by ID error: ${error.message}`);
      next(error);
    }
  }

  /**
   * PUT /api/rates/diamonds/:id
   * Update a diamond rate
   */
  async updateDiamondRate(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const diamondRate = await diamondRateService.updateDiamondRate(
        id,
        updateData,
        req.session.user._id
      );

      // Recalculate product variant prices if rate changed
      if (updateData.ratePerPiece) {
        priceCalculationService
          .recalculateAllVariantsForRateChange('diamond', id)
          .catch((err) => logger.error(`Price recalculation error: ${err.message}`));
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Diamond rate updated successfully',
        data: diamondRate,
      });
    } catch (error) {
      logger.error(`Update diamond rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * DELETE /api/rates/diamonds/:id
   * Delete a diamond rate
   */
  async deleteDiamondRate(req, res, next) {
    try {
      const { id } = req.params;
      const diamondRate = await diamondRateService.deleteDiamondRate(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Diamond rate deleted successfully',
        data: diamondRate,
      });
    } catch (error) {
      logger.error(`Delete diamond rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/diamonds/active
   * Get all active diamonds for product variant selection
   */
  async getActiveDiamonds(req, res, next) {
    try {
      const diamonds = await diamondRateService.getActiveDiamonds();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Active diamonds retrieved successfully',
        data: diamonds,
      });
    } catch (error) {
      logger.error(`Get active diamonds error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/diamonds/by-category
   * Get diamonds grouped by category
   */
  async getDiamondsByCategory(req, res, next) {
    try {
      const diamonds = await diamondRateService.getDiamondsByCategory();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Diamonds retrieved successfully',
        data: diamonds,
      });
    } catch (error) {
      logger.error(`Get diamonds by category error: ${error.message}`);
      next(error);
    }
  }

  /**
   * PATCH /api/rates/diamonds/bulk-update
   * Bulk update diamond rates
   */
  async bulkUpdateDiamondRates(req, res, next) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new AppError('Updates must be a non-empty array', 400);
      }

      const results = await diamondRateService.bulkUpdateDiamondRates(
        updates,
        req.session.user._id
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: `${results.length} diamond rates updated successfully`,
        data: results,
      });
    } catch (error) {
      logger.error(`Bulk update diamond rates error: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new DiamondRateController();
