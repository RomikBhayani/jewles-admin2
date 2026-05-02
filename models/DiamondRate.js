const mongoose = require('mongoose');

const diamondRateSchema = new mongoose.Schema(
  {
    // Diamond type (e.g., Real/Natural, Lab Grown, Moissanite)
    name: {
      type: String,
      required: [true, 'Diamond type name is required'],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      index: true,
    },

    // Code/abbreviation (e.g., NAT, LAB, MOIS)
    code: {
      type: String,
      required: [true, 'Diamond code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
      index: true,
    },

    // Rate per diamond piece in USD
    // This is a fixed rate per piece, not per carat
    ratePerPiece: {
      type: Number,
      required: [true, 'Rate per piece is required'],
      min: [0, 'Rate must be a positive number'],
      set: (v) => parseFloat(v).toFixed(2),
    },

    // Currency code (default USD)
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR'],
    },

    // Diamond category/quality (for future granular pricing)
    category: {
      type: String,
      enum: ['premium', 'standard', 'basic'],
      default: 'standard',
    },

    // Description
    description: {
      type: String,
      maxlength: 500,
    },

    // Color representation for UI
    color: {
      type: String,
      default: '#FFFFFF', // White/clear diamond by default
    },

    // Icon/emoji for quick visual identification
    icon: {
      type: String,
      default: '💎',
    },

    // Is this diamond type active/available
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
    collection: 'diamond_rates',
  }
);

// Index for active diamonds and sorting
diamondRateSchema.index({ isActive: 1, name: 1 });
diamondRateSchema.index({ code: 1 });

// Middleware to maintain history
diamondRateSchema.pre('findByIdAndUpdate', async function (next) {
  const update = this.getUpdate();
  if (update.ratePerPiece) {
    const doc = await this.model.findById(this.getFilter()._id);
    if (doc) {
      update.$push = update.$push || {};
      update.$push.history = {
        rate: doc.ratePerPiece,
        updatedAt: new Date(),
        updatedBy: update.lastUpdatedBy,
      };
      update.lastUpdatedAt = new Date();
    }
  }
  next();
});

// Virtual for formatted rate display
diamondRateSchema.virtual('formattedRate').get(function () {
  return `${this.currency} ${this.ratePerPiece.toFixed(2)}`;
});

diamondRateSchema.set('toJSON', { virtuals: true });
diamondRateSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('DiamondRate', diamondRateSchema);
