import type { ServerResponse } from 'node:http'
import { getServiceClient, isUuid, type Donation } from '../../_lib/db.js'
import { sendSignedRequestNotice } from '../../_lib/email.js'
import { getSiteUrl, readBody, sendJson, type ApiRequest } from '../../_lib/sslcommerz.js'

// A donor asks for a hand-signed copy of their receipt. The client is notified by email
// and the request appears in the admin Donations page until the signed copy is sent.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  try {
    const body = await readBody(req)

    if (!isUuid(body.ref)) {
      return sendJson(res, 400, { error: 'invalid_ref' })
    }

    const client = getServiceClient()
    const { data: updated, error } = await client
      .from('donations')
      .update({
        signed_receipt_status: 'requested',
        signed_receipt_requested_at: new Date().toISOString(),
      })
      .eq('receipt_token', body.ref)
      .in('status', ['paid', 'review'])
      .eq('signed_receipt_status', 'none')
      .select('*')
      .maybeSingle()

    if (error) {
      throw error
    }

    if (updated) {
      await sendSignedRequestNotice(updated as Donation, getSiteUrl(req)).catch((noticeError) =>
        console.error('[receipts/request-signed] notice failed', noticeError),
      )
      return sendJson(res, 200, { signedReceiptStatus: 'requested' })
    }

    // Already requested or sent: report the current state instead of an error.
    const { data: existing } = await client
      .from('donations')
      .select('signed_receipt_status')
      .eq('receipt_token', body.ref)
      .in('status', ['paid', 'review'])
      .maybeSingle()

    return existing
      ? sendJson(res, 200, { signedReceiptStatus: existing.signed_receipt_status })
      : sendJson(res, 404, { error: 'not_found' })
  } catch (error) {
    console.error('[receipts/request-signed]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
