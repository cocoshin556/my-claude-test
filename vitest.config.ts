import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      // tsconfig の paths と揃える（テストから @/ で import できるように）
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
