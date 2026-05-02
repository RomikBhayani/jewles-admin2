const mongoose = require('mongoose');

const themeConfigSchema = new mongoose.Schema(
  {
    // Theme name and description
    name: {
      type: String,
      required: true,
      unique: true,
      default: 'default',
      index: true,
    },

    description: {
      type: String,
      default: '',
    },

    // Color Configuration
    colors: {
      primary: { type: String, default: '#2563eb' },
      primaryLight: { type: String, default: '#3b82f6' },
      primaryDark: { type: String, default: '#1d4ed8' },

      secondary: { type: String, default: '#10b981' },
      secondaryLight: { type: String, default: '#34d399' },
      secondaryDark: { type: String, default: '#059669' },

      accent: { type: String, default: '#f59e0b' },
      accentLight: { type: String, default: '#fbbf24' },
      accentDark: { type: String, default: '#d97706' },

      danger: { type: String, default: '#ef4444' },
      dangerLight: { type: String, default: '#f87171' },
      dangerDark: { type: String, default: '#dc2626' },

      warning: { type: String, default: '#eab308' },
      success: { type: String, default: '#22c55e' },
      info: { type: String, default: '#06b6d4' },

      // Neutral palette
      gray50: { type: String, default: '#f9fafb' },
      gray100: { type: String, default: '#f3f4f6' },
      gray200: { type: String, default: '#e5e7eb' },
      gray300: { type: String, default: '#d1d5db' },
      gray400: { type: String, default: '#9ca3af' },
      gray500: { type: String, default: '#6b7280' },
      gray600: { type: String, default: '#4b5563' },
      gray700: { type: String, default: '#374151' },
      gray800: { type: String, default: '#1f2937' },
      gray900: { type: String, default: '#111827' },

      // Functional colors
      background: { type: String, default: '#ffffff' },
      surface: { type: String, default: '#f9fafb' },
      border: { type: String, default: '#e5e7eb' },
      text: { type: String, default: '#111827' },
      textSecondary: { type: String, default: '#6b7280' },
    },

    // Dark Mode Colors
    darkMode: {
      enabled: { type: Boolean, default: true },
      colors: {
        background: { type: String, default: '#111827' },
        surface: { type: String, default: '#1f2937' },
        border: { type: String, default: '#374151' },
        text: { type: String, default: '#f9fafb' },
        textSecondary: { type: String, default: '#d1d5db' },
      },
    },

    // Typography Configuration
    typography: {
      fontFamily: {
        base: {
          type: String,
          default:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        mono: { type: String, default: '"Courier New", Courier, monospace' },
      },

      fontSize: {
        xs: { type: String, default: '0.75rem' },
        sm: { type: String, default: '0.875rem' },
        base: { type: String, default: '1rem' },
        lg: { type: String, default: '1.125rem' },
        xl: { type: String, default: '1.25rem' },
        '2xl': { type: String, default: '1.5rem' },
        '3xl': { type: String, default: '1.875rem' },
        '4xl': { type: String, default: '2.25rem' },
      },

      fontWeight: {
        light: { type: Number, default: 300 },
        normal: { type: Number, default: 400 },
        medium: { type: Number, default: 500 },
        semibold: { type: Number, default: 600 },
        bold: { type: Number, default: 700 },
      },

      lineHeight: {
        tight: { type: Number, default: 1.2 },
        snug: { type: Number, default: 1.375 },
        normal: { type: Number, default: 1.5 },
        relaxed: { type: Number, default: 1.625 },
        loose: { type: Number, default: 2 },
      },
    },

    // Spacing Configuration
    spacing: {
      0: { type: String, default: '0' },
      1: { type: String, default: '0.25rem' },
      2: { type: String, default: '0.5rem' },
      3: { type: String, default: '0.75rem' },
      4: { type: String, default: '1rem' },
      6: { type: String, default: '1.5rem' },
      8: { type: String, default: '2rem' },
      10: { type: String, default: '2.5rem' },
      12: { type: String, default: '3rem' },
      16: { type: String, default: '4rem' },
      20: { type: String, default: '5rem' },
      24: { type: String, default: '6rem' },
    },

    // Border Radius Configuration
    borderRadius: {
      none: { type: String, default: '0' },
      sm: { type: String, default: '0.375rem' },
      base: { type: String, default: '0.5rem' },
      md: { type: String, default: '0.75rem' },
      lg: { type: String, default: '1rem' },
      xl: { type: String, default: '1.5rem' },
      full: { type: String, default: '9999px' },
    },

    // Shadows Configuration
    shadows: {
      none: { type: String, default: 'none' },
      sm: { type: String, default: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
      base: {
        type: String,
        default:
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      md: {
        type: String,
        default:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      lg: {
        type: String,
        default:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      xl: {
        type: String,
        default:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },

    // Transitions Configuration
    transitions: {
      fast: { type: String, default: '150ms ease-in-out' },
      base: { type: String, default: '250ms ease-in-out' },
      slow: { type: String, default: '350ms ease-in-out' },
    },

    // Component-specific overrides
    components: {
      sidebar: {
        width: { type: String, default: '260px' },
        bgColor: { type: String, default: 'var(--color-surface)' },
        textColor: { type: String, default: 'var(--color-text)' },
        borderColor: { type: String, default: 'var(--color-border)' },
      },

      topbar: {
        height: { type: String, default: '64px' },
        bgColor: { type: String, default: 'var(--color-surface)' },
        textColor: { type: String, default: 'var(--color-text)' },
        borderColor: { type: String, default: 'var(--color-border)' },
      },

      card: {
        bgColor: { type: String, default: 'var(--color-surface)' },
        borderColor: { type: String, default: 'var(--color-border)' },
        borderRadius: { type: String, default: '0.75rem' },
        boxShadow: { type: String, default: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
        padding: { type: String, default: '1.5rem' },
      },

      table: {
        headerBgColor: { type: String, default: 'var(--color-gray100)' },
        headerTextColor: { type: String, default: 'var(--color-gray900)' },
        rowHoverBgColor: { type: String, default: 'var(--color-gray50)' },
        borderColor: { type: String, default: 'var(--color-border)' },
      },

      button: {
        borderRadius: { type: String, default: '0.5rem' },
        padding: { type: String, default: '0.5rem 1rem' },
        fontSize: { type: String, default: '0.875rem' },
        fontWeight: { type: String, default: '600' },
      },

      input: {
        borderColor: { type: String, default: 'var(--color-border)' },
        borderRadius: { type: String, default: '0.5rem' },
        padding: { type: String, default: '0.5rem 0.75rem' },
        fontSize: { type: String, default: '0.875rem' },
      },

      badge: {
        borderRadius: { type: String, default: '9999px' },
        padding: { type: String, default: '0.25rem 0.75rem' },
        fontSize: { type: String, default: '0.75rem' },
        fontWeight: { type: String, default: '600' },
      },
    },

    // Active status
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Audit fields
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
    collection: 'theme_configs',
  }
);

// Index for active theme
themeConfigSchema.index({ isActive: 1 });

// Static method to get active theme
themeConfigSchema.statics.getActive = async function () {
  let theme = await this.findOne({ isActive: true });
  if (!theme) {
    theme = await this.findOne({ name: 'default' });
  }
  return theme;
};

// Static method to set active theme
themeConfigSchema.statics.setActive = async function (themeId) {
  await this.updateMany({ isActive: true }, { isActive: false });
  return this.findByIdAndUpdate(themeId, { isActive: true }, { new: true });
};

module.exports = mongoose.model('ThemeConfig', themeConfigSchema);
