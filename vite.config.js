import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173, // Vite dev server port
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend server port
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});