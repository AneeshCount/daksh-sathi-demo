/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the V33 docs (dark emerald headers)
        brand: { DEFAULT: '#0e5f3a', dark: '#08402a', deep: '#062d1e', light: '#15804e', tint: '#e9f3ec' },
        gold: { DEFAULT: '#d4a017', soft: '#f7ecd2' },
        cream: '#f7f8f5',   // app background, warmer than slate
        inkx: '#14201a',    // primary text
        sage2: '#5f6f66',   // secondary text
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
