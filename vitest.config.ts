import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from "path"

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend/src"),
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './frontend/src/test/setup.ts',
    include: ['frontend/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  }
})
