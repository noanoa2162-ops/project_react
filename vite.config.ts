import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'query': ['@tanstack/react-query'],
          'mobx': ['mobx', 'mobx-react-lite']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
