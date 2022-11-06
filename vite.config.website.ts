import { defineConfig } from "vite";

module.exports = defineConfig({
  root: 'src-website',
  base: '/extract-colors/',
  build: {
    outDir: '../extract-colors'
  }
})
