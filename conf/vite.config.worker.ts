import path from "path";
import { UserConfig } from "vite";
import conf from "./vite.config";

export default {
  ...conf,
  define: {
    __DEV__: JSON.stringify(`process.env.NODE_ENV !== "production"`),
  },
  build: {
    ...conf.build,
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "../src/workerWrapper.ts"),
      name: "ExtractColors",
      fileName: (format) =>
        `worker-wrapper.${format === "es" ? "mjs" : format}`,
      formats: ["cjs", "es"],
    },
  },
} satisfies UserConfig;
