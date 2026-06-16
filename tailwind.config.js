/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the V33 docs (dark emerald headers)
        brand: {
          DEFAULT: '#0f5132',
          dark: '#0a3d26',
          light: '#16794a',
        },
        gold: '#d4a017', // Platinum accent
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
