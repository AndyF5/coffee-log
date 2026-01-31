import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './vite.config.ts',
    test: {
      name: 'unit',
      globals: true,
      include: ['src/**/*.spec.{ts,tsx}'],
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  },
  {
    test: {
      name: 'rules',
      include: ['rules-tests/**/*.spec.ts'],
      environment: 'node',
      setupFiles: './rules-tests/setup.ts',
      testTimeout: 30000,
    },
  },
]);
