import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/RAVS-WEB-3D/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});