import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/productos': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
      '/clientes': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
      '/usuarios': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
      '/ventas': {
        target: 'http://10.20.0.101:3001',
        changeOrigin: true,
      },
    }
  }
})
