const mongoose = require('mongoose');

const metalRateSchema = new mongoose.Schema(
  {
    // Metal name (e.g., Gold, Silver, Platinum, Rose Gold)
    name: {
      type: String,
      required: [true, 'Metal name is required'],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      index: true,
    },

    // Human-readable code/abbreviation (e.g., AU, AG, PT, RG)
    code: {
      type: String,
      required: [true, 'Metal code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
      index: true,
    },

    // Rate per gram in USD
    ratePerGram: {
      type: Number,
      required: [true, 'Rate per gram is required'],
      min: [0, 'Rate must be a positive number'],
      set: (v) => parseFloat(v).toFixed(2),
    },

    // Currency code (default USD)
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR'],
    },

    // Description of the metal
    description: {
      type: String,
      maxlength: 500,
    },

    // Density in g/cm³ (for future weight calculations)
    density: {
      type: Number,
      min: 0,
    },

    // Color representation for UI
    color: {
      type: String,
      default: '#FFD700', // Gold color by default
    },

    // Is this metal active/available
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // Last updated timestamp
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },

    // Admin who made the last update
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    // Audit trail
    history: [
      {
        rate: Number,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'metal_rates',
  }
);

// Index for active metals and sorting by name
metalRateSchema.index({ isActive: 1, name: 1 });
metalRateSchema.index({ code: 1 });

// Middleware to maintain history
metalRateSchema.pre('findByIdAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.ratePerGram) {
    const doc = await this.model.findById(this.getFilter()._id);
    if (doc) {
      update.$push = update.$push || {};
      update.$push.history = {
        rate: doc.ratePerGram,
        updatedAt: new Date(),
        updatedBy: update.lastUpdatedBy,
      };
      update.lastUpdatedAt = new Date();
    }
  }
  next();
});

// Virtual for formatted rate display
metalRateSchema.virtual('formattedRate').get(function () {
  return `${this.currency} ${this.ratePerGram.toFixed(2)}`;
});

metalRateSchema.set('toJSON', { virtuals: true });
metalRateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('MetalRate', metalRateSchema);
