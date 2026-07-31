import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  // The Angular plugin compiles components (including templateUrl/styleUrls)
  // and emits the DI metadata the TestBed needs. Without it, esbuild strips
  // constructor parameter types and every constructor-injected class fails
  // to instantiate with NG0202.
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    reporters: 'default',
  },
});
