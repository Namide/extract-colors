import { defineConfig } from 'vitest/config';

module.exports = defineConfig({
  define: {
    __DEV__: `true`,
    __BROWSER__: 'true'
  },
  test: {
    include: ['tests/*.ts'],
    environment: 'node',
  },
});