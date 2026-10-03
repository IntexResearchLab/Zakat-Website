import { defineConfig, loadEnv, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Serves the Vercel functions in /api during `npm run dev`, so the payment flow
// can be tested locally. In production Vercel runs these files itself.
const localApiFunctions = (): Plugin => ({
  name: 'local-api-functions',
  configureServer(server) {
    server.middlewares.use('/api/', async (req, res, next) => {
      const route = (req.url ?? '').split('?')[0].replace(/^\/+|\/+$/g, '')

      if (!/^[a-z0-9/-]+$/i.test(route) || route.split('/').some((part) => part.startsWith('_'))) {
        return next()
      }

      try {
        const module = await server.ssrLoadModule(`/api/${route}.ts`)
        await module.default(req, res)
      } catch (error) {
        if ((error as { code?: string }).code === 'ERR_LOAD_URL') {
          return next()
        }
        server.config.logger.error(String(error))
        res.statusCode = 500
        res.end('Local API error')
      }
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make server-only variables (no VITE_ prefix) available to the local API functions.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['SSLCOMMERZ_STORE_ID', 'SSLCOMMERZ_STORE_PASSWORD', 'SSLCOMMERZ_SANDBOX', 'SITE_URL']) {
    if (env[key] && !process.env[key]) {
      process.env[key] = env[key]
    }
  }

  return {
    plugins: [tailwindcss(), react(), localApiFunctions()],
  }
})
