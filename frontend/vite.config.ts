import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/categories': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/products': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/batches': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/attachments': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/business-entities': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/inventories': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/waste-records': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/purchases': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api/sales': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
      '/api/traceability': {
        target: 'http://localhost:8085',
        changeOrigin: true,
      }
    }
  }
})
