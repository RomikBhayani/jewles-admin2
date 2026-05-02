const mongoose = require('mongoose');

const variantSelectorSchema = new mongoose.Schema(
  {
    // Type of selector (e.g., 'metal', 'karat', 'diamond', 'finish', 'shape')
    type: {
      type: String,
      required: [true, 'Selector type is required'],
      unique: true,
      lowercase: true,
      trim: true,
      enum: ['metal', 'karat', 'diamond', 'finish', 'shape'],
      index: true,
    },

    // Display name
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
    },

    // Description
    description: {
      type: String,
      maxlength: 500,
    },

    // Order in which selectors appear on product creation form
    order: {
      type: Number,
      default: 0,
      index: true,
    },

    // Available options for this selector
    options: [
      {
        // Option name (e.g., 'Gold', '18K', 'Real Diamond')
        name: {
          type: String,
          required: true,
        },

        // Option value/code
        value: {
          type: String,
          required: true,
        },

        // Display label (can differ from name)
        label: String,

        // Color for UI representation
        color: String,

        // Icon/emoji
        icon: String,

        // For 'karat' type: purity factor (18K = 0.75, 20K = 0.833, etc.)
        // For 'metal' type: reference to MetalRate via code
        // For 'diamond' type: reference to DiamondRate via code
        metadata: mongoose.Schema.Types.Mixed,

        // Order within this selector
        order: Number,

        // Active status
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // Is this selector active
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Allow multiple selections for this selector
    allowMultiple: {
      type: Boolean,
      default: false,
    },

    // Is this selector required when creating a product
    isRequired: {
      type: Boolean,
      default: true,
    },

    // Last updated
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    collection: 'variant_selectors',
  }
);

// Index for active selectors
variantSelectorSchema.index({ isActive: 1, order: 1 });
variantSelectorSchema.index({ type: 1 });

// Predefined Karat Purity Factors
variantSelectorSchema.statics.KARAT_PURITY_FACTORS = {
  '18K': 0.75,
  '20K': 0.833,
  '22K': 0.916,
  '24K': 1.0,
};

// Static method to get selector options by type
variantSelectorSchema.statics.getOptionsByType = async function (type) {
  const selector = await this.findOne({ type, isActive: true });
  if (!selector) return [];
  return selector.options.filter((opt) => opt.isActive);
};

// Static method to initialize default selectors
variantSelectorSchema.statics.initializeDefaults = async function () {
  const defaults = [
    {
      type: 'metal',
      displayName: 'Metal Type',
      description: 'Select the metal for your product',
      order: 1,
      isRequired: true,
      options: [
        { name: 'Gold', value: 'gold', color: '#FFD700', order: 1, isActive: true },
        { name: 'Silver', value: 'silver', color: '#C0C0C0', order: 2, isActive: true },
        { name: 'Platinum', value: 'platinum', color: '#E8E8E8', order: 3, isActive: true },
        { name: 'Rose Gold', value: 'rose_gold', color: '#B76E79', order: 4, isActive: true },
      ],
    },
    {
      type: 'karat',
      displayName: 'Karat Purity',
      description: 'Select the karat purity',
      order: 2,
      isRequired: true,
      options: [
        { name: '18K', value: '18k', metadata: { purity: 0.75 }, order: 1, isActive: true },
        { name: '20K', value: '20k', metadata: { purity: 0.833 }, order: 2, isActive: true },
        { name: '22K', value: '22k', metadata: { purity: 0.916 }, order: 3, isActive: true },
        { name: '24K', value: '24k', metadata: { purity: 1.0 }, order: 4, isActive: true },
      ],
    },
    {
      type: 'diamond',
      displayName: 'Diamond Type',
      description: 'Select the diamond type',
      order: 3,
      isRequired: false,
      options: [
        { name: 'Real Diamond', value: 'real', icon: '💎', order: 1, isActive: true },
        { name: 'Lab Grown', value: 'lab_grown', icon: '🔬', order: 2, isActive: true },
        { name: 'Moissanite', value: 'moissanite', icon: '✨', order: 3, isActive: true },
      ],
    },
  ];

  for (const defaultSelector of defaults) {
    const exists = await this.findOne({ type: defaultSelector.type });
    if (!exists) {
      await this.create(defaultSelector);
    }
  }
};

module.exports = mongoose.model('VariantSelector', variantSelectorSchema);
