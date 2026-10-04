import type { ServerResponse } from 'node:http'
import { sendJson, type ApiRequest } from './sslcommerz.js'

type Handler = (req: ApiRequest, res: ServerResponse) => unknown

// Vercel's free plan allows 12 functions per deployment, so related endpoints share one
// function file ("api/admin/[action].ts") and are dispatched here by the last path segment.
// The public addresses (/api/admin/resend-receipt and so on) stay the same.
export const routeByAction = (handlers: Record<string, Handler>) => (req: ApiRequest, res: ServerResponse) => {
  const url = new URL(req.url ?? '', 'http://localhost')
  const action = url.searchParams.get('action') ?? url.pathname.split('/').filter(Boolean).pop() ?? ''
  const handler = Object.hasOwn(handlers, action) ? handlers[action] : undefined

  if (!handler) {
    return sendJson(res, 404, { error: 'not_found' })
  }

  return handler(req, res)
}
