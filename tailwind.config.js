/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Primary Colors */
        primary: '#3B82F6',
        'primary-light': '#60A5FA',
        'primary-dark': '#2563EB',

        /* Secondary Colors */
        secondary: '#06B6D4',
        'secondary-light': '#22D3EE',
        'secondary-dark': '#0891B2',

        /* Accent Color */
        accent: '#A855F7',
        'accent-light': '#D8B4FE',
        'accent-dark': '#7E22CE',

        /* Status Colors */
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#F43F5E',
        info: '#0EA5E9',

        /* Neutral Colors */
        'off-white': '#F1F5F9',
        'gray-50': '#E2E8F0',
        'gray-100': '#CBD5E1',
        'gray-400': '#94A3B8',
        'gray-600': '#475569',

        /* Slate Colors */
        'slate-900': '#0F172A',
        'slate-800': '#1E293B',
      },
      fontFamily: {
        base: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.6' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['2rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.5rem', { lineHeight: '1.2' }],
        '7xl': ['4.5rem', { lineHeight: '1.2' }],
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0em',
        wide: '0.05em',
        wider: '0.1em',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.4',
        relaxed: '1.5',
        loose: '1.6',
        'very-loose': '1.8',
      },
    },
  },
  plugins: [],
};
