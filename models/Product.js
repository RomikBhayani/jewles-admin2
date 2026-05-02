const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Basic Product Information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: 200,
      index: true,
    },

    description: {
      type: String,
      maxlength: 5000,
    },

    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['ring', 'necklace', 'bracelet', 'earring', 'pendant', 'other'],
      index: true,
    },

    // Material Information
    material: {
      // Total weight of the product in grams
      weightGrams: {
        type: Number,
        required: [true, 'Total weight is required'],
        min: [0.1, 'Weight must be greater than 0'],
      },

      // Number of diamonds in the product
      diamondCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        order: Number,
      },
    ],

    // Variant Selectors selected for this product
    // This defines which combination options are available
    variantSelectors: [
      {
        selectorType: {
          type: String,
          enum: ['metal', 'karat', 'diamond', 'finish', 'shape'],
        },
        selectedOptions: [
          {
            name: String,
            value: String,
            metadata: mongoose.Schema.Types.Mixed,
          },
        ],
      },
    ],

    // Making charges (as percentage of material cost)
    makingChargePercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // GST/Tax percentage
    taxPercent: {
      type: Number,
      default: 18,
      min: 0,
      max: 100,
    },

    // Base price (before calculations) - optional
    basePrice: {
      type: Number,
      min: 0,
    },

    // Discount percentage
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Product status
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive', 'archived'],
      default: 'draft',
      index: true,
    },

    // SEO
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],

    // Stock information
    stock: {
      quantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
      },
    },

    // Ratings & Reviews
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    // Admin notes
    notes: String,

    // Audit
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

// Indexes for common queries
productSchema.index({ status: 1, category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ name: 'text', description: 'text' });

// Virtual for current stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock.quantity === 0) return 'out_of_stock';
  if (this.stock.quantity <= this.stock.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
