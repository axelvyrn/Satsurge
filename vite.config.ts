import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    // Polyfills Buffer, process, and other Node globals for both dev + build
    nodePolyfills({
      // Optional: helps when imports use node:protocol style
      protocolImports: true,
    }),
  ],
  optimizeDeps: {
    // Ensure buffer is pre-bundled during dev
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
});
