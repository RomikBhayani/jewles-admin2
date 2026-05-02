const MetalRate = require('../models/MetalRate');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Metal Rate Service
 * Handles all business logic for metal rates
 */

class MetalRateService {
  /**
   * Create a new metal rate
   */
  async createMetalRate(data, adminId) {
    try {
      const metalRate = new MetalRate({
        ...data,
        lastUpdatedBy: adminId,
      });

      await metalRate.save();
      logger.info(`Metal rate created: ${data.name}`);
      return metalRate;
    } catch (error) {
      logger.error(`Error creating metal rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all metal rates with pagination and filters
   */
  async getAllMetalRates({
    page = 1,
    limit = 10,
    search = '',
    isActive = true,
    sortBy = 'name',
    sortOrder = 'asc',
  } = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = isActive !== undefined ? { isActive } : {};

      // Add search filter
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ];
      }

      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [data, total] = await Promise.all([
        MetalRate.find(query).sort(sort).skip(skip).limit(limit),
        MetalRate.countDocuments(query),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error(`Error fetching metal rates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a single metal rate by ID
   */
  async getMetalRateById(id) {
    try {
      const metalRate = await MetalRate.findById(id);
      if (!metalRate) {
        throw new AppError('Metal rate not found', 404);
      }
      return metalRate;
    } catch (error) {
      logger.error(`Error fetching metal rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a metal rate
   */
  async updateMetalRate(id, updateData, adminId) {
    try {
      const metalRate = await MetalRate.findByIdAndUpdate(
        id,
        {
          ...updateData,
          lastUpdatedBy: adminId,
          lastUpdatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!metalRate) {
        throw new AppError('Metal rate not found', 404);
      }

      logger.info(`Metal rate updated: ${metalRate.name}`);
      return metalRate;
    } catch (error) {
      logger.error(`Error updating metal rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a metal rate (soft delete via status)
   */
  async deleteMetalRate(id) {
    try {
      const metalRate = await MetalRate.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!metalRate) {
        throw new AppError('Metal rate not found', 404);
      }

      logger.info(`Metal rate deleted: ${metalRate.name}`);
      return metalRate;
    } catch (error) {
      logger.error(`Error deleting metal rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get metal rate by code (used in pricing calculations)
   */
  async getMetalRateByCode(code) {
    try {
      const metalRate = await MetalRate.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

      if (!metalRate) {
        throw new AppError(`Metal rate not found for code: ${code}`, 404);
      }

      return metalRate;
    } catch (error) {
      logger.error(`Error fetching metal rate by code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all active metals (for product variant selection)
   */
  async getActiveMetals() {
    try {
      return await MetalRate.find({ isActive: true }).sort({ name: 1 });
    } catch (error) {
      logger.error(`Error fetching active metals: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk update metal rates
   */
  async bulkUpdateMetalRates(updates, adminId) {
    try {
      const results = await Promise.all(
        updates.map((update) =>
          MetalRate.findByIdAndUpdate(
            update.id,
            {
              ratePerGram: update.ratePerGram,
              lastUpdatedBy: adminId,
              lastUpdatedAt: new Date(),
            },
            { new: true }
          )
        )
      );

      logger.info(`Bulk updated ${results.length} metal rates`);
      return results;
    } catch (error) {
      logger.error(`Error bulk updating metal rates: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new MetalRateService();
