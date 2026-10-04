import type { ServerResponse } from 'node:http'
import { getServiceClient, isUuid, type Donation } from '../../_lib/db.js'
import { sendJson, type ApiRequest } from '../../_lib/sslcommerz.js'

// Public receipt summary for the thank-you page and the link in the receipt email.
// The unguessable receipt token is the only key, and contact details are never returned.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  const ref = new URL(req.url ?? '', 'http://localhost').searchParams.get('ref')

  if (!isUuid(ref)) {
    return sendJson(res, 400, { error: 'invalid_ref' })
  }

  try {
    const { data } = await getServiceClient()
      .from('donations')
      .select('*')
      .eq('receipt_token', ref)
      .maybeSingle()
    const donation = data as Donation | null

    if (!donation || !['paid', 'review'].includes(donation.status)) {
      return sendJson(res, 404, { error: 'not_found' })
    }

    return sendJson(res, 200, {
      status: donation.status,
      donorName: donation.donor_name,
      amount: Number(donation.paid_amount ?? donation.amount),
      category: donation.category,
      paidAt: donation.paid_at,
      tranId: donation.tran_id,
      receiptNumber: donation.receipt_number,
      receiptEmailed: Boolean(donation.receipt_sent_at),
      signedReceiptStatus: donation.signed_receipt_status,
    })
  } catch (error) {
    console.error('[receipts/details]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
