import { defineConfig } from 'vitest/config';
import { existsSync } from 'fs';
import { resolve } from 'path';

const vitestSrc = resolve(__dirname, '.vitest-src', 'src');
const vitestRoot = resolve(__dirname, '.vitest-src');

export default defineConfig({
  // Use the generated .vitest-src as Vite root when available so relative imports
  // inside the project resolve to the inlined files.
  root: existsSync(vitestRoot) ? vitestRoot : undefined,
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    reporters: 'default',
  },
  resolve: {
    alias: existsSync(vitestSrc) ? [{ find: /^src\/(.*)/, replacement: `${vitestSrc}/$1` }] : [],
  },
});
