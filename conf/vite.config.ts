import path from "path";
import { UserConfig } from "vite";

export default {
  define: {
    // __DEV__: JSON.stringify(`process.env.NODE_ENV !== "production"`)
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "../src/main.ts"),
      name: "ExtractColors",
      fileName: (format) =>
        `extract-colors.${format === "es" ? "mjs" : format}`,
      formats: ["cjs", "es"],
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
            "requestMode",
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
            "extractColorsFromImageBitmap",
            "extractColorsFromSrc",
          ],
        },
      },
    },
    rollupOptions: {
      output: {
        dir: "./lib",
      },
    },
  },
} satisfies UserConfig;
