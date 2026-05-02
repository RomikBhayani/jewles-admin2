const productService = require('../services/productService');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Product Controller
 * Handles all HTTP requests related to products and variants
 */

class ProductController {
  /**
   * POST /api/products
   * Create a new product with variants
   */
  async createProduct(req, res, next) {
    try {
      const { productData, variantSelections } = req.body;

      if (!productData) {
        throw new AppError('Product data is required', 400);
      }

      const product = await productService.createProduct(
        productData,
        variantSelections,
        req.session.user._id
      );

      res.status(201).json({
        success: true,
        statusCode: 201,
        message: 'Product created successfully with variants',
        data: product,
      });
    } catch (error) {
      logger.error(`Create product error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/products
   * Get all products with pagination and filters
   */
  async getProducts(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        category = '',
        status = 'active',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const result = await productService.getAllProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        category,
        status,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error(`Get products error: ${error.message}`);
      next(error);
    }
  }

  /**
   * GET /api/products/:id
   * Get product with its variants
   */
  async getProductWithVariants(req, res, next) {
    try {
      const { id } = req.params;
      const result = await productService.getProductWithVariants(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: result,
      });
    } catch (error) {
      logger.error(`Get product with variants error: ${error.message}`);
      next(error);
    }
  }

  /**
   * PUT /api/products/:id
   * Update product
   */
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await productService.updateProduct(
        id,
        updateData,
        req.session.user._id
      );

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      logger.error(`Update product error: ${error.message}`);
      next(error);
    }
  }

  /**
   * DELETE /api/products/:id
   * Delete product (soft delete)
   */
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.deleteProduct(id);

      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Product deleted successfully',
        data: product,
      });
    } catch (error) {
      logger.error(`Delete product error: ${error.message}`);
      next(error);
    }
  }
}

module.exports = new ProductController();
