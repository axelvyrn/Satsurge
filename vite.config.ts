import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Prebundle buffer so it’s available during Vite’s dep optimization
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Auto-inject global Buffer for any module referencing it
        inject({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
})
