import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#FAFBFD',
          soft: '#F2F5FA',
        },
        ink: {
          DEFAULT: '#0B1220',
          muted: '#5B6478',
          subtle: '#8A93A6',
        },
        accent: {
          DEFAULT: '#2F6BFF',
          soft: '#6A9BFF',
          ring: 'rgba(47, 107, 255, 0.18)',
          glow: 'rgba(47, 107, 255, 0.35)',
        },
        line: '#E6EAF2',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '24px',
        xl4: '28px',
      },
      boxShadow: {
        card: '0 8px 30px rgba(15, 23, 42, 0.06)',
        cardLg: '0 20px 60px rgba(15, 23, 42, 0.08)',
        glow: '0 10px 40px rgba(47, 107, 255, 0.35)',
        glowSoft: '0 6px 24px rgba(47, 107, 255, 0.22)',
      },
      fontSize: {
        h1: ['32px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        h2: ['24px', { lineHeight: '30px', letterSpacing: '-0.01em', fontWeight: '700' }],
        sub: ['16px', { lineHeight: '24px', letterSpacing: '-0.005em' }],
        btn: ['17px', { lineHeight: '22px', letterSpacing: '-0.005em', fontWeight: '600' }],
        meta: ['13px', { lineHeight: '18px', letterSpacing: '0.01em' }],
      },
      keyframes: {
        breathe: {
          '0%, 100%': { boxShadow: '0 10px 40px rgba(47,107,255,0.28)' },
          '50%': { boxShadow: '0 14px 56px rgba(47,107,255,0.42)' },
        },
        floatIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        breathe: 'breathe 3.6s ease-in-out infinite',
        floatIn: 'floatIn 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
