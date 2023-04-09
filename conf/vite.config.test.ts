import { defineConfig } from 'vitest/config';

module.exports = defineConfig({
  define: {
    __DEV__: `process.env.NODE_ENV !== "production"`,
    __BROWSER__: 'true'
  },
  test: {
    include: ['tests/*.ts'],
    environment: 'node',
  },
});