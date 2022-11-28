import { defineConfig } from 'vitest/config';

module.exports = defineConfig({
  test: {
    include: ['tests/*.ts'],
    environment: 'node',
  },
});