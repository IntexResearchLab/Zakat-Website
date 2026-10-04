import type { ServerResponse } from 'node:http'
import { getServiceClient, isUuid, requireAdmin } from '../_lib/db.js'
import { readBody, sendJson, type ApiRequest } from '../_lib/sslcommerz.js'

// Admin: delete a donation that was recorded by mistake. Only manual entries can be deleted;
// online payments are financial records confirmed by SSLCommerz and always stay.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  try {
    if (!(await requireAdmin(req))) {
      return sendJson(res, 401, { error: 'unauthorized' })
    }

    const body = await readBody(req)

    if (!isUuid(body.id)) {
      return sendJson(res, 400, { error: 'invalid_id' })
    }

    const { data, error } = await getServiceClient()
      .from('donations')
      .delete()
      .eq('id', body.id)
      .eq('source', 'manual')
      .select('id')

    if (error) {
      throw error
    }

    return data?.length ? sendJson(res, 200, { deleted: true }) : sendJson(res, 404, { error: 'not_found' })
  } catch (error) {
    console.error('[admin/delete-donation]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
