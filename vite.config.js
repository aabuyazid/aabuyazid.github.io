import { defineConfig } from 'vite';

// Deployed at https://aabuyazid.github.io (a GitHub user site), so the site
// lives at the domain root and needs no sub-path base.
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
