const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const VariantSelector = require('../models/VariantSelector');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');
const priceCalculationService = require('./priceCalculationService');

/**
 * Product Service
 * Handles product creation, updates, and variant management
 */

class ProductService {
  /**
   * Create a new product with variants
   */
  async createProduct(productData, variantSelectionsData, adminId) {
    try {
      // Create the product
      const product = new Product({
        ...productData,
        createdBy: adminId,
      });

      await product.save();
      logger.info(`Product created: ${product.name} (${product.sku})`);

      // Generate and save variants
      if (variantSelectionsData && variantSelectionsData.length > 0) {
        await this.generateAndSaveVariants(
          product._id,
          variantSelectionsData,
          product,
          adminId
        );
      }

      return product;
    } catch (error) {
      logger.error(`Error creating product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate all possible variant combinations
   */
  async generateAndSaveVariants(
    productId,
    variantSelections,
    product,
    adminId
  ) {
    try {
      // Get all selector options
      const selectors = await VariantSelector.find({ isActive: true }).lean();

      // Map selected options
      const selectedOptions = {};
      for (const selection of variantSelections) {
        selectedOptions[selection.type] = selection.values;
      }

      // Generate combinations
      const combinations = this.generateCombinations(
        selectedOptions,
        selectors
      );

      // Create variants for each combination
      const variantsToCreate = [];
      for (const combination of combinations) {
        const pricing = await priceCalculationService.calculateVariantPrice(
          product,
          combination
        );

        const variantSku = `${product.sku}-${combination
          .map((c) => c.selectedValue.substring(0, 3).toUpperCase())
          .join('-')}`;

        variantsToCreate.push({
          productId,
          combination,
          variantSku,
          pricing,
          isActive: true,
          createdBy: adminId,
        });
      }

      await ProductVariant.insertMany(variantsToCreate);
      logger.info(
        `Generated ${variantsToCreate.length} variants for product ${productId}`
      );

      return variantsToCreate;
    } catch (error) {
      logger.error(`Error generating variants: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate all possible combinations from selections
   */
  generateCombinations(selectedOptions, selectors) {
    const selectorTypes = Object.keys(selectedOptions);
    const arrays = selectorTypes.map((type) => {
      const selector = selectors.find((s) => s.type === type);
      if (!selector) return [];

      return selectedOptions[type].map((value) => {
        const option = selector.options.find((o) => o.value === value);
        return {
          selectorType: type,
          selectedValue: value,
          selectedName: option?.name || value,
          metadata: option?.metadata,
        };
      });
    });

    // Generate cartesian product
    return this.cartesianProduct(...arrays);
  }

  /**
   * Cartesian product helper
   */
  cartesianProduct(...arrays) {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map((x) => [x]);

    const [head, ...tail] = arrays;
    const tailProduct = this.cartesianProduct(...tail);

    return head.flatMap((h) => tailProduct.map((t) => [h, ...t]));
  }

  /**
   * Get all products with pagination
   */
  async getAllProducts({
    page = 1,
    limit = 10,
    search = '',
    category = '',
    status = 'active',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (status) query.status = status;
      if (category) query.category = category;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
        ];
      }

      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const [data, total] = await Promise.all([
        Product.find(query)
          .populate('createdBy', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        Product.countDocuments(query),
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
      logger.error(`Error fetching products: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get product details with variants
   */
  async getProductWithVariants(productId) {
    try {
      const product = await Product.findById(productId).populate(
        'createdBy',
        'name email'
      );
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      const variants = await ProductVariant.find({
        productId,
        isActive: true,
      });

      return {
        product,
        variants,
        variantCount: variants.length,
      };
    } catch (error) {
      logger.error(`Error fetching product with variants: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId, updateData, adminId) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        {
          ...updateData,
          updatedBy: adminId,
        },
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      logger.info(`Product updated: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Error updating product: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(productId) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        { status: 'archived' },
        { new: true }
      );

      if (!product) {
        throw new AppError('Product not found', 404);
      }

      logger.info(`Product deleted: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(`Error deleting product: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new ProductService();
