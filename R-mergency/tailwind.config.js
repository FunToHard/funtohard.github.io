/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        canvas: 'rgb(var(--study-paper-rgb) / <alpha-value>)',
        surface: 'rgb(var(--study-surface-rgb) / <alpha-value>)',
        wash: 'rgb(var(--study-wash-rgb) / <alpha-value>)',
        ink: 'rgb(var(--study-ink-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--study-secondary-rgb) / <alpha-value>)',
        muted: 'rgb(var(--study-muted-rgb) / <alpha-value>)',
        rule: 'rgb(var(--study-rule-rgb) / <alpha-value>)',
        accent: 'rgb(var(--study-accent-rgb) / <alpha-value>)',

        trap: {
          DEFAULT: '#dc2626',
          muted: '#991b1b',
          bg: '#fef2f2',
          darkbg: '#450a0a',
        },
        cram: {
          DEFAULT: '#d97706',
          muted: '#b45309',
          bg: '#fffbeb',
          darkbg: '#451a03',
        },
      },
    },
  },
  plugins: [],
};
