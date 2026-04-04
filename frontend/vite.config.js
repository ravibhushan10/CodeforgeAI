import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: {
          'react-vendor':  ['react', 'react-dom', 'react-router-dom'],
          'query-vendor':  ['@tanstack/react-query'],
          'firebase-vendor': ['firebase/app', 'firebase/auth'],
        },
      },
    },
    // Warn if any chunk exceeds 600kb
    chunkSizeWarningLimit: 600,
  },

  server: {
    port: 5173,
    headers: {
      'Cross-Origin-Opener-Policy':   'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
