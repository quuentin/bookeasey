import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts',
    './app.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'display-xl': ['3.25rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['1.375rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-3': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65' }],
        'body': ['0.9375rem', { lineHeight: '1.65' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.55' }],
        'caption': ['0.75rem', { lineHeight: '1.45', letterSpacing: '0.01em' }],
      },
      colors: {
        // Accent principal — violet/indigo (style Liberlo)
        brand: {
          50: '#f3f0ff',
          100: '#e9e3ff',
          200: '#d5ccff',
          300: '#b5a3ff',
          400: '#9171ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#2e1065',
        },
        // Gris neutres
        slate: {
          25: '#fcfcfd',
          50: '#f8f9fb',
          100: '#f1f3f6',
          150: '#e8ebf0',
          200: '#dfe3ea',
          300: '#c1c7d2',
          400: '#8d95a5',
          500: '#5f6879',
          600: '#454d5e',
          700: '#333a49',
          800: '#1f2533',
          900: '#141825',
        },
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'elevated': '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'glow': '0 0 24px -4px rgba(124,58,237,0.25)',
        'glow-lg': '0 0 40px -4px rgba(124,58,237,0.35)',
        'input-focus': '0 0 0 3px rgba(124,58,237,0.1)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'float': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-gradient': {
          'background': 'linear-gradient(135deg, #7c3aed, #a78bfa)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
      })
    }),
  ],
} satisfies Config
