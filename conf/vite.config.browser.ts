import path from 'path';
import { defineConfig } from 'vite';

module.exports = defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, '../src/extractColors.browser.ts'),
      name: 'ExtractColors',
      fileName: (format) => `extract-colors.browser.${format}.js`,
    },
    minify: "terser",
    terserOptions: {
      mangle: {
        properties: {
          reserved: [
            "pixels",
            "distance",
            "colorValidator",
            "hueDistance",
            "saturationDistance",
            "lightnessDistance",
            "crossOrigin",
            "hex",
            "red",
            "green",
            "blue",
            "area",
            "hue",
            "saturation",
            "lightness",
            "intensity",
            "extractColors",
            "extractColorsFromImage",
            "extractColorsFromImageData",
            "extractColorsFromSrc"
          ],
        }
      }
    },
    rollupOptions: {
      output: {
        dir: './lib'
      },
    },
  },
});