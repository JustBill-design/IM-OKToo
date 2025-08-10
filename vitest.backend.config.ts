import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 60000,
    setupFiles: [
      './backend/src/test/crypto-polyfill.ts',
      './backend/src/test/cloud-test-setup.ts'
    ],
    include: ['backend/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['node_modules', 'dist', 'frontend', 'backend/node_modules/**/*'],
    // try run tests sequentially as it crashed my laptop 
    fileParallelism: false,
    maxConcurrency: 1
  }
})
