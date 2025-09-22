// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'bolt11', 'bitcoinjs-lib'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // This is the key for dev pre-bundling
      inject: [path.resolve(__dirname, 'src/shims-esbuild.js')],
    },
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      // This helps in build output when Buffer is referenced
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
});
