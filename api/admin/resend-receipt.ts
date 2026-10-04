import type { ServerResponse } from 'node:http'
import { getServiceClient, isUuid, requireAdmin, type Donation } from '../_lib/db.js'
import { deliverReceipt } from '../_lib/donations.js'
import { getSiteUrl, readBody, sendJson, type ApiRequest } from '../_lib/sslcommerz.js'

// Admin: email the digital receipt again. For a donation held for review, this also
// approves it as paid, which assigns its receipt number.
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

    const client = getServiceClient()
    const { data } = await client.from('donations').select('*').eq('id', body.id).maybeSingle()
    let donation = data as Donation | null

    if (!donation || !['paid', 'review'].includes(donation.status)) {
      return sendJson(res, 404, { error: 'not_found' })
    }

    if (!donation.donor_email) {
      return sendJson(res, 400, { error: 'no_email' })
    }

    if (donation.status === 'review') {
      const { data: approved, error } = await client
        .from('donations')
        .update({ status: 'paid' })
        .eq('id', donation.id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      donation = approved as Donation
    }

    const { donation: delivered, sent } = await deliverReceipt(donation, getSiteUrl(req))

    return sent
      ? sendJson(res, 200, { donation: delivered })
      : sendJson(res, 502, { error: 'email_failed', donation: delivered })
  } catch (error) {
    console.error('[admin/resend-receipt]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
