import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import inject from '@rollup/plugin-inject';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  optimizeDeps: {
    // Make sure buffer is pre-bundled so it’s available to deps
    include: ['buffer', 'bolt11', 'bitcoinjs-lib'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // Prepend this to pre-bundled deps so Buffer exists during scan
      banner: {
        js: `
        import { Buffer } from "buffer";
        if (!globalThis.Buffer) globalThis.Buffer = Buffer;
        `,
      },
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Ensure Buffer exists in the production bundle too
        inject({
          Buffer: ['buffer', 'Buffer'],
        }),
      ],
    },
  },
});
