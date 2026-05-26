import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const devPort = Number(process.env.OFFICIAL_WEB_DEV_PORT || 5188)
const dockerDev = process.env.DOCKER_DEV === '1'

/** Dev-only: map clean paths to public index.html (matches nginx try_files in production). */
function publicDirectoryIndexPlugin(): Plugin {
  const rewrites: [RegExp, string][] = [
    [/^\/terms\/?$/, '/terms/index.html'],
    [/^\/privacy\/?$/, '/privacy/index.html'],
    [/^\/en\/terms\/?$/, '/en/terms/index.html'],
    [/^\/en\/privacy\/?$/, '/en/privacy/index.html'],
    [/^\/about\/?$/, '/about/index.html'],
    [/^\/en\/about\/?$/, '/en/about/index.html'],
  ]
  return {
    name: 'public-directory-index',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        for (const [pattern, target] of rewrites) {
          if (pattern.test(pathname)) {
            req.url = target
            break
          }
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), publicDirectoryIndexPlugin()],
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
