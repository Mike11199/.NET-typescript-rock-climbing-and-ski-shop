import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './build',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: true,
        secure: false
      },
      '/apiv2/':{
        target: 'http://127.0.0.1:5001/',
        changeOrigin: true,
        secure: false
    },
    // Proxy WebSocket connections for socket.io
    '/socket.io': {
      target: 'http://127.0.0.1:5000/',
      ws: true,
      changeOrigin: true,
      secure: false
    },
    '/socket.io/**': {
      target: 'http://127.0.0.1:5000/',
      ws: true,
      changeOrigin: true,
      secure: false
    }
  }
}});
