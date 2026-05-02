const metalRateService = require('../services/metalRateService');
const priceCalculationService = require('../services/priceCalculationService');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Metal Rate Controller
 * Handles all HTTP requests related to metal rates
 */

class MetalRateController {
  /**
   * POST /api/rates/metals
   * Create a new metal rate
   */
  async createMetalRate(req, res) {
    try {
      const { name, code, ratePerGram, currency, description, color } =
        req.body;

      const metalRate = await metalRateService.createMetalRate(
        { name, code, ratePerGram, currency, description, color },
        req.session.user._id
      );

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Metal rate created successfully',
        data: metalRate,
      });
    } catch (error) {
      logger.error(`Create metal rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/metals
   * Get all metal rates with pagination and filters
   */
  async getMetalRates(req, res) {
    try {
      const { page = 1, limit = 10, search = '', isActive = true, sortBy = 'name', sortOrder = 'asc' } = req.query;

      const result = await metalRateService.getAllMetalRates({
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
        message: 'Metal rates retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error(`Get metal rates error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/metals/:id
   * Get a single metal rate by ID
   */
  async getMetalRateById(req, res, next) {
    try {
      const { id } = req.params;
      const metalRate = await metalRateService.getMetalRateById(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Metal rate retrieved successfully',
        data: metalRate,
      });
    } catch (error) {
      logger.error(`Get metal rate by ID error: ${error.message}`);
      next(error);
    }
  }

  /**
   * PUT /api/rates/metals/:id
   * Update a metal rate
   */
  async updateMetalRate(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const metalRate = await metalRateService.updateMetalRate(
        id,
        updateData,
        req.session.user._id
      );

      // Recalculate product variant prices if rate changed
      if (updateData.ratePerGram) {
        priceCalculationService
          .recalculateAllVariantsForRateChange('metal', id)
          .catch((err) => logger.error(`Price recalculation error: ${err.message}`));
      }

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Metal rate updated successfully',
        data: metalRate,
      });
    } catch (error) {
      logger.error(`Update metal rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * DELETE /api/rates/metals/:id
   * Delete a metal rate
   */
  async deleteMetalRate(req, res, next) {
    try {
      const { id } = req.params;
      const metalRate = await metalRateService.deleteMetalRate(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Metal rate deleted successfully',
        data: metalRate,
      });
    } catch (error) {
      logger.error(`Delete metal rate error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/rates/metals/active
   * Get all active metals for product variant selection
   */
  async getActiveMetals(req, res, next) {
    try {
      const metals = await metalRateService.getActiveMetals();

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Active metals retrieved successfully',
        data: metals,
      });
    } catch (error) {
      logger.error(`Get active metals error: ${error.message}`);
      next(error);
    }
  }

  /**
   * PATCH /api/rates/metals/bulk-update
   * Bulk update metal rates
   */
  async bulkUpdateMetalRates(req, res, next) {
    try {
      const { updates } = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        throw new AppError('Updates must be a non-empty array', 400);
      }

      const results = await metalRateService.bulkUpdateMetalRates(
        updates,
        req.session.user._id
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: `${results.length} metal rates updated successfully`,
        data: results,
      });
    } catch (error) {
      logger.error(`Bulk update metal rates error: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new MetalRateController();
