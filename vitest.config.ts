import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/renderer/src/test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@': resolve(__dirname, 'src/renderer/src')
    }
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, 'src/renderer/src'),
      '@': resolve(__dirname, 'src/renderer/src')
    }
  }
})
