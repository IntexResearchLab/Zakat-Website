import type { ServerResponse } from 'node:http'
import { getServiceClient, isUuid, requireAdmin, type Donation } from '../../_lib/db.js'
import { sendSignedReceiptEmail } from '../../_lib/email.js'
import { readBody, sendJson, type ApiRequest } from '../../_lib/sslcommerz.js'

const BUCKET = 'signed-receipts'

// Admin: after uploading the scanned, hand-signed receipt to private storage,
// email it to the donor as an attachment and mark the request as completed.
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
    const path = String(body.path ?? '')

    // Uploads are stored under the donation's own folder, so a path can't point at another donor's file.
    if (!isUuid(body.id) || !path.startsWith(`${body.id}/`) || path.includes('..')) {
      return sendJson(res, 400, { error: 'invalid_request' })
    }

    const client = getServiceClient()
    const { data } = await client
      .from('donations')
      .select('*')
      .eq('id', body.id)
      .eq('status', 'paid')
      .maybeSingle()

    if (!data) {
      return sendJson(res, 404, { error: 'not_found' })
    }

    const donation = data as Donation

    if (!donation.donor_email) {
      return sendJson(res, 400, { error: 'no_email' })
    }
    const { data: file, error: downloadError } = await client.storage.from(BUCKET).download(path)

    if (downloadError || !file) {
      return sendJson(res, 404, { error: 'file_not_found' })
    }

    const extension = path.split('.').pop()?.toLowerCase() ?? 'pdf'
    await sendSignedReceiptEmail(donation, {
      filename: `Alokayon-signed-receipt-${donation.receipt_number ?? donation.tran_id}.${extension}`,
      content: Buffer.from(await file.arrayBuffer()),
    })

    const { data: updated, error } = await client
      .from('donations')
      .update({
        signed_receipt_status: 'sent',
        signed_receipt_path: path,
        signed_receipt_sent_at: new Date().toISOString(),
      })
      .eq('id', donation.id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return sendJson(res, 200, { donation: updated })
  } catch (error) {
    console.error('[admin/send-signed-receipt]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
