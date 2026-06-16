import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ultra-light build, no code-split bloat — tuned for a Hostinger VPS / static host.
export default defineConfig({
  // Relative base so the build works on a GitHub Pages project subpath
  // (username.github.io/repo/) as well as at a domain root / Hostinger VPS.
  base: './',
  plugins: [react()],
  build: { target: 'es2018', cssCodeSplit: false },
});
