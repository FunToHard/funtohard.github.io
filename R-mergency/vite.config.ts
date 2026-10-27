import { defineConfig } from 'vite';

export default defineConfig({
  base: '/R-mergency/',
  publicDir: '../public',
  build: {
    copyPublicDir: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    allowedHosts: ['funtohard.github.io', 'localhost', 'https://home.local'],
  },
});
