/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0ff',
          100: '#e0e0ff',
          200: '#c7c4ff',
          300: '#a5a0ff',
          400: '#8b7fff',
          500: '#7c5cfc',
          600: '#6d3ff4',
          700: '#5e30e0',
          800: '#4e28b7',
          900: '#412594',
          950: '#271565',
        },
        sidebar: {
          DEFAULT: '#0c0f1a',
          light: '#151929',
        },
        surface: {
          DEFAULT: '#f7f8fc',
          card: '#ffffff',
          dark: '#1a1d2e',
          'dark-card': '#222640',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
