const MetalRate = require('../models/MetalRate');
const DiamondRate = require('../models/DiamondRate');
const VariantSelector = require('../models/VariantSelector');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

/**
 * Price Calculation Service
 * Handles dynamic price calculation for product variants
 * Formula: Metal Cost + Diamond Cost + Making Charges + Tax - Discount
 */

class PriceCalculationService {
  /**
   * Calculate price for a variant combination
   */
  async calculateVariantPrice(product, combination) {
    try {
      let metalCost = 0;
      let diamondCost = 0;

      // Extract metal, karat, and diamond from combination
      const metalItem = combination.find((c) => c.selectorType === 'metal');
      const karatItem = combination.find((c) => c.selectorType === 'karat');
      const diamondItem = combination.find((c) => c.selectorType === 'diamond');

      // Calculate metal cost
      if (metalItem) {
        const metalRate = await MetalRate.findOne({
          code: metalItem.selectedValue.toUpperCase(),
          isActive: true,
        });

        if (!metalRate) {
          throw new AppError(
            `Metal rate not found: ${metalItem.selectedValue}`,
            404
          );
        }

        const purityFactor = karatItem?.metadata?.purity || 1.0;
        metalCost =
          metalRate.ratePerGram *
          product.material.weightGrams *
          purityFactor;
      }

      // Calculate diamond cost
      if (diamondItem && product.material.diamondCount > 0) {
        const diamondRate = await DiamondRate.findOne({
          code: diamondItem.selectedValue.toUpperCase(),
          isActive: true,
        });

        if (!diamondRate) {
          throw new AppError(
            `Diamond rate not found: ${diamondItem.selectedValue}`,
            404
          );
        }

        diamondCost = diamondRate.ratePerPiece * product.material.diamondCount;
      }

      // Calculate making charges
      const subtotal = metalCost + diamondCost;
      const makingCharges = (subtotal * product.makingChargePercent) / 100;

      // Calculate tax
      const beforeTax = subtotal + makingCharges;
      const tax = (beforeTax * product.taxPercent) / 100;

      // Calculate discount
      const beforeDiscount = beforeTax + tax;
      const discount = (beforeDiscount * product.discountPercent) / 100;

      // Final price
      const finalPrice = beforeDiscount - discount;

      return {
        metalCost: parseFloat(metalCost.toFixed(2)),
        diamondCost: parseFloat(diamondCost.toFixed(2)),
        makingCharges: parseFloat(makingCharges.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax: parseFloat(tax.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        finalPrice: parseFloat(finalPrice.toFixed(2)),
      };
    } catch (error) {
      logger.error(`Error calculating variant price: ${error.message}`);
      throw error;
    }
  }

  /**
   * Recalculate prices for all variants of a product
   * (Called when rates or product settings change)
   */
  async recalculateProductVariantPrices(productId, product) {
    try {
      const ProductVariant = require('../models/ProductVariant');
      const variants = await ProductVariant.find({ productId });

      const updatePromises = variants.map(async (variant) => {
        const newPricing = await this.calculateVariantPrice(
          product,
          variant.combination
        );

        return ProductVariant.findByIdAndUpdate(
          variant._id,
          { pricing: newPricing },
          { new: true }
        );
      });

      const updatedVariants = await Promise.all(updatePromises);
      logger.info(`Recalculated prices for ${updatedVariants.length} variants`);

      return updatedVariants;
    } catch (error) {
      logger.error(
        `Error recalculating product variant prices: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Recalculate all product variant prices when a rate changes
   */
  async recalculateAllVariantsForRateChange(rateType, rateId) {
    try {
      const Product = require('../models/Product');
      const ProductVariant = require('../models/ProductVariant');

      // Find all variants affected by this rate change
      let variants;
      if (rateType === 'metal') {
        variants = await ProductVariant.find({
          'combination.selectorType': 'metal',
        }).populate('productId');
      } else if (rateType === 'diamond') {
        variants = await ProductVariant.find({
          'combination.selectorType': 'diamond',
        }).populate('productId');
      }

      if (!variants || variants.length === 0) {
        return [];
      }

      // Group by product and recalculate
      const productMap = new Map();
      for (const variant of variants) {
        if (!productMap.has(variant.productId._id.toString())) {
          productMap.set(
            variant.productId._id.toString(),
            variant.productId
          );
        }
      }

      const updatedVariants = [];
      for (const [productId, product] of productMap) {
        const recalculated = await this.recalculateProductVariantPrices(
          productId,
          product
        );
        updatedVariants.push(...recalculated);
      }

      logger.info(
        `Recalculated prices for ${updatedVariants.length} variants due to ${rateType} rate change`
      );
      return updatedVariants;
    } catch (error) {
      logger.error(
        `Error recalculating variants for rate change: ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Get price breakdown for customer (for frontend display)
   */
  getPriceBreakdown(pricing) {
    return {
      metal: `$${pricing.metalCost.toFixed(2)}`,
      diamonds: `$${pricing.diamondCost.toFixed(2)}`,
      makingCharges: `$${pricing.makingCharges.toFixed(2)}`,
      subtotal: `$${pricing.subtotal.toFixed(2)}`,
      tax: `$${pricing.tax.toFixed(2)}`,
      discount: `$${pricing.discount.toFixed(2)}`,
      total: `$${pricing.finalPrice.toFixed(2)}`,
    };
  }
}

module.exports = new PriceCalculationService();
