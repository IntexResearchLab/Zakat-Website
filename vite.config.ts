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
        let module
        try {
          module = await server.ssrLoadModule(`/api/${route}.ts`)
        } catch (error) {
          // Like Vercel, fall back to a shared "[action].ts" function in the same folder.
          const folder = route.split('/').slice(0, -1).join('/')
          if ((error as { code?: string }).code !== 'ERR_LOAD_URL' || !folder) {
            throw error
          }
          module = await server.ssrLoadModule(`/api/${folder}/[action].ts`)
        }
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
  const serverKeys = [
    'SSLCOMMERZ_STORE_ID',
    'SSLCOMMERZ_STORE_PASSWORD',
    'SSLCOMMERZ_SANDBOX',
    'SITE_URL',
    'VITE_SUPABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RECEIPT_FROM_EMAIL',
    'RECEIPT_REPLY_TO',
    'ADMIN_NOTIFY_EMAIL',
  ]
  for (const key of serverKeys) {
    if (env[key] && !process.env[key]) {
      process.env[key] = env[key]
    }
  }

  return {
    plugins: [tailwindcss(), react(), localApiFunctions()],
  }
})
