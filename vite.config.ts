import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'redirect-root',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/') req.url = '/desktop.html'
          next()
        })
      },
    },
  ],
  server: { open: '/desktop.html' },
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        desktop: resolve(__dirname, 'desktop.html'),
      },
    },
  },
})
