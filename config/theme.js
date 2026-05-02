/**
 * Default Theme Configuration
 * This can be overridden via the database ThemeConfig model
 * All UI components derive their styling from this configuration
 */

const defaultTheme = {
  // Color Palette
  colors: {
    // Primary colors
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',

    // Secondary colors
    secondary: '#10b981',
    secondaryLight: '#34d399',
    secondaryDark: '#059669',

    // Accent colors
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',

    // Status colors
    danger: '#ef4444',
    dangerLight: '#f87171',
    dangerDark: '#dc2626',

    warning: '#eab308',
    success: '#22c55e',
    info: '#06b6d4',

    // Neutral colors
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',

    // Functional colors
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    text: '#111827',
    textSecondary: '#6b7280',
  },

  // Dark mode color overrides
  dark: {
    background: '#111827',
    surface: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
  },

  // Typography
  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"Courier New", Courier, monospace',
    },

    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },

    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },

    lineHeight: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    6: '1.5rem', // 24px
    8: '2rem', // 32px
    10: '2.5rem', // 40px
    12: '3rem', // 48px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.375rem', // 6px
    base: '0.5rem', // 8px
    md: '0.75rem', // 12px
    lg: '1rem', // 16px
    xl: '1.5rem', // 24px
    full: '9999px',
  },

  // Shadows
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // Component-specific overrides
  components: {
    // Sidebar styling
    sidebar: {
      width: '260px',
      bgColor: 'var(--color-surface)',
      textColor: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },

    // Topbar styling
    topbar: {
      height: '64px',
      bgColor: 'var(--color-surface)',
      textColor: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },

    // Card styling
    card: {
      bgColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
    },

    // Table styling
    table: {
      headerBgColor: 'var(--color-gray100)',
      headerTextColor: 'var(--color-gray900)',
      rowHoverBgColor: 'var(--color-gray50)',
      borderColor: 'var(--color-border)',
    },

    // Button styling
    button: {
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: 600,
    },

    // Input styling
    input: {
      borderColor: 'var(--color-border)',
      borderRadius: '0.5rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
    },

    // Badge styling
    badge: {
      borderRadius: '9999px',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
  },
};

module.exports = defaultTheme;
