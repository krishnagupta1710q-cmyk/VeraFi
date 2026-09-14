/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      colors: {
        paper: {
          DEFAULT: '#f4f1ea',
          light: '#faf8f5',
          dark: '#e8e4d9',
        },
        ink: {
          DEFAULT: '#2c2a25',
          light: '#4a473f',
          lighter: '#6b665c',
        },
        brand: {
          50: '#f2f6f3',
          100: '#e1ebe4',
          500: '#4a7c59',
          600: '#3a6347',
          700: '#2b4a35',
        },
        vintage: {
          red: '#8b3a3a',
          gold: '#c9a227',
          border: '#d0c8b6',
        }
      },
      boxShadow: {
        'vintage': '4px 4px 0px 0px rgba(44, 42, 37, 0.1)',
        'vintage-hover': '2px 2px 0px 0px rgba(44, 42, 37, 0.1)',
      }
    },
  },
  plugins: [],
}
