const DiamondRate = require('../models/DiamondRate');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Diamond Rate Service
 * Handles all business logic for diamond rates
 */

class DiamondRateService {
  /**
   * Create a new diamond rate
   */
  async createDiamondRate(data, adminId) {
    try {
      const diamondRate = new DiamondRate({
        ...data,
        lastUpdatedBy: adminId,
      });

      await diamondRate.save();
      logger.info(`Diamond rate created: ${data.name}`);
      return diamondRate;
    } catch (error) {
      logger.error(`Error creating diamond rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all diamond rates with pagination and filters
   */
  async getAllDiamondRates({
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
        DiamondRate.find(query).sort(sort).skip(skip).limit(limit),
        DiamondRate.countDocuments(query),
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
      logger.error(`Error fetching diamond rates: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a single diamond rate by ID
   */
  async getDiamondRateById(id) {
    try {
      const diamondRate = await DiamondRate.findById(id);
      if (!diamondRate) {
        throw new AppError('Diamond rate not found', 404);
      }
      return diamondRate;
    } catch (error) {
      logger.error(`Error fetching diamond rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a diamond rate
   */
  async updateDiamondRate(id, updateData, adminId) {
    try {
      const diamondRate = await DiamondRate.findByIdAndUpdate(
        id,
        {
          ...updateData,
          lastUpdatedBy: adminId,
          lastUpdatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!diamondRate) {
        throw new AppError('Diamond rate not found', 404);
      }

      logger.info(`Diamond rate updated: ${diamondRate.name}`);
      return diamondRate;
    } catch (error) {
      logger.error(`Error updating diamond rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a diamond rate (soft delete via status)
   */
  async deleteDiamondRate(id) {
    try {
      const diamondRate = await DiamondRate.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!diamondRate) {
        throw new AppError('Diamond rate not found', 404);
      }

      logger.info(`Diamond rate deleted: ${diamondRate.name}`);
      return diamondRate;
    } catch (error) {
      logger.error(`Error deleting diamond rate: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get diamond rate by code (used in pricing calculations)
   */
  async getDiamondRateByCode(code) {
    try {
      const diamondRate = await DiamondRate.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

      if (!diamondRate) {
        throw new AppError(`Diamond rate not found for code: ${code}`, 404);
      }

      return diamondRate;
    } catch (error) {
      logger.error(`Error fetching diamond rate by code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all active diamonds (for product variant selection)
   */
  async getActiveDiamonds() {
    try {
      return await DiamondRate.find({ isActive: true }).sort({ name: 1 });
    } catch (error) {
      logger.error(`Error fetching active diamonds: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all diamond rates grouped by category
   */
  async getDiamondsByCategory() {
    try {
      return await DiamondRate.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', diamonds: { $push: '$$ROOT' } } },
        { $sort: { _id: 1 } },
      ]);
    } catch (error) {
      logger.error(`Error fetching diamonds by category: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bulk update diamond rates
   */
  async bulkUpdateDiamondRates(updates, adminId) {
    try {
      const results = await Promise.all(
        updates.map((update) =>
          DiamondRate.findByIdAndUpdate(
            update.id,
            {
              ratePerPiece: update.ratePerPiece,
              lastUpdatedBy: adminId,
              lastUpdatedAt: new Date(),
            },
            { new: true }
          )
        )
      );

      logger.info(`Bulk updated ${results.length} diamond rates`);
      return results;
    } catch (error) {
      logger.error(`Error bulk updating diamond rates: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new DiamondRateService();
