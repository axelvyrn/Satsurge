// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import inject from "file:///home/project/node_modules/@rollup/plugin-inject/dist/es/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: "buffer"
    }
  },
  optimizeDeps: {
    // Make sure buffer is pre-bundled so it’s available to deps
    include: ["buffer", "bolt11", "bitcoinjs-lib"],
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      // Prepend this to pre-bundled deps so Buffer exists during scan
      banner: `
        import { Buffer } from "buffer";
        if (!globalThis.Buffer) globalThis.Buffer = Buffer;
      `
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        // Ensure Buffer exists in the production bundle too
        inject({
          Buffer: ["buffer", "Buffer"]
        })
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgaW5qZWN0IGZyb20gJ0Byb2xsdXAvcGx1Z2luLWluamVjdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBidWZmZXI6ICdidWZmZXInLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIE1ha2Ugc3VyZSBidWZmZXIgaXMgcHJlLWJ1bmRsZWQgc28gaXRcdTIwMTlzIGF2YWlsYWJsZSB0byBkZXBzXG4gICAgaW5jbHVkZTogWydidWZmZXInLCAnYm9sdDExJywgJ2JpdGNvaW5qcy1saWInXSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICAgICAgfSxcbiAgICAgIC8vIFByZXBlbmQgdGhpcyB0byBwcmUtYnVuZGxlZCBkZXBzIHNvIEJ1ZmZlciBleGlzdHMgZHVyaW5nIHNjYW5cbiAgICAgIGJhbm5lcjogYFxuICAgICAgICBpbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyXCI7XG4gICAgICAgIGlmICghZ2xvYmFsVGhpcy5CdWZmZXIpIGdsb2JhbFRoaXMuQnVmZmVyID0gQnVmZmVyO1xuICAgICAgYCxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgLy8gRW5zdXJlIEJ1ZmZlciBleGlzdHMgaW4gdGhlIHByb2R1Y3Rpb24gYnVuZGxlIHRvb1xuICAgICAgICBpbmplY3Qoe1xuICAgICAgICAgIEJ1ZmZlcjogWydidWZmZXInLCAnQnVmZmVyJ10sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFFbkIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBO0FBQUEsSUFFWixTQUFTLENBQUMsVUFBVSxVQUFVLGVBQWU7QUFBQSxJQUM3QyxnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLFFBQVE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUlWO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsU0FBUztBQUFBO0FBQUEsUUFFUCxPQUFPO0FBQUEsVUFDTCxRQUFRLENBQUMsVUFBVSxRQUFRO0FBQUEsUUFDN0IsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
