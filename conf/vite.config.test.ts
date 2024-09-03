import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __DEV__: "true",
    __BROWSER__: "true",
  },
  test: {
    include: ["tests/*.ts"],
    environment: "node",
    coverage: {
      provider: "istanbul", // or 'v8'
    },
  },
});
