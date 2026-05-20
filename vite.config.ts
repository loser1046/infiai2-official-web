import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const devPort = Number(process.env.OFFICIAL_WEB_DEV_PORT || 5188)
const dockerDev = process.env.DOCKER_DEV === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: dockerDev ? true : process.env.VITE_DEV_HOST === '0.0.0.0',
    port: devPort,
    strictPort: true,
    watch: dockerDev
      ? {
          usePolling: true,
          interval: 300,
        }
      : undefined,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        en: path.resolve(__dirname, 'en/index.html'),
      },
    },
  },
})
