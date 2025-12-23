import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/exam': 'http://localhost:3000',
      '/payment': 'http://localhost:3000',
      '/admin': 'http://localhost:3000'
    }
  }
})