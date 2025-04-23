import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for VITE_API_FOOTER
      '/api-timestamp': {
        target: 'http://localhost:60001',  // Your backend API server
        changeOrigin: true,               // Ensure the origin header is modified
        rewrite: (path) => path.replace(/^\/api-timestamp/, '/api-timestamp'),
      },

      // Proxy for VITE_API_FILTER
      '/api-inti': {
        target: 'http://localhost:60001',  // Your backend API server
        changeOrigin: true,               // Ensure the origin header is modified
        rewrite: (path) => path.replace(/^\/api-inti/, '/api-inti'),
      },

      // Proxy for VITE_API_DATA
      '/api-data': {
        target: 'http://localhost:60001',  // Your backend API server
        changeOrigin: true,               // Ensure the origin header is modified
        rewrite: (path) => path.replace(/^\/api-data/, '/api-data'),
      },
    },
  },
});
