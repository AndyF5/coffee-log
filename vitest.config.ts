import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
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
    ],
  },
});
