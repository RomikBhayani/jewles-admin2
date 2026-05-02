const mongoose = require('mongoose');

const productVariantSchema = new mongoose.Schema(
  {
    // Reference to parent product
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },

    // Variant combination (e.g., Gold + 18K + Real Diamond)
    combination: [
      {
        selectorType: {
          type: String,
          enum: ['metal', 'karat', 'diamond', 'finish', 'shape'],
          required: true,
        },
        selectedValue: {
          type: String,
          required: true,
        },
        selectedName: String,
        metadata: mongoose.Schema.Types.Mixed,
      },
    ],

    // Unique SKU for this variant
    variantSku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    // Price Calculation Details
    pricing: {
      // Cost breakdown
      metalCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      diamondCost: {
        type: Number,
        default: 0,
        min: 0,
      },
      makingCharges: {
        type: Number,
        default: 0,
        min: 0,
      },
      subtotal: {
        type: Number,
        default: 0,
        min: 0,
      },
      tax: {
        type: Number,
        default: 0,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      // Final price
      finalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // Stock for this variant
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Is variant available
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Variant-specific images (optional, can override product images)
    images: [
      {
        url: String,
        altText: String,
        isPrimary: Boolean,
      },
    ],

    // Variant-specific attributes
    attributes: mongoose.Schema.Types.Mixed,

    // Creation and update info
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    collection: 'product_variants',
  }
);

// Compound index for product and variant combination
productVariantSchema.index({ productId: 1, variantSku: 1 });
productVariantSchema.index({ productId: 1, isActive: 1 });
productVariantSchema.index({
  combination: 1,
});

// Virtual for formatted price
productVariantSchema.virtual('formattedPrice').get(function () {
  return `$${this.pricing.finalPrice.toFixed(2)}`;
});

// Method to get combination as string (e.g., "Gold-18K-Real Diamond")
productVariantSchema.methods.getCombinationString = function () {
  return this.combination.map((item) => item.selectedName || item.selectedValue).join('-');
};

// Static method to find variant by combination
productVariantSchema.statics.findByProductAndCombination = async function (productId, combination) {
  return this.findOne({
    productId,
    combination: combination,
  });
};

productVariantSchema.set('toJSON', { virtuals: true });
productVariantSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ProductVariant', productVariantSchema);
