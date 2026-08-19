import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 墨黑 + 渐变高光
        ink: {
          950: '#05060a',
          900: '#0a0d14',
          800: '#0f1320',
          700: '#161b2d',
          600: '#1f2438',
        },
        accent: {
          50:  '#ecfeff',
          200: '#a5f3fc',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        display: ['"Cal Sans"', 'ui-sans-serif', 'system-ui', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      backgroundImage: {
        'grid-fade': 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(5,6,10,1) 90%), radial-gradient(circle at 50% 0%, rgba(139,92,246,0.15), transparent 60%)',
        'noise': "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-pan': {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-dot': {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.4' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'pulse-dot': 'pulse-dot 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;