import type { ServerResponse } from 'node:http'
import { getCampaignTitle, getServiceClient, isUuid, type Donation } from '../../_lib/db.js'
import { buildReceiptPdf, receiptFileName } from '../../_lib/receipt.js'
import { sendJson, type ApiRequest } from '../../_lib/sslcommerz.js'

// Downloads the digital receipt PDF. Used by donors and by the admin when printing a copy to sign.
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
      .eq('status', 'paid')
      .maybeSingle()

    if (!data) {
      return sendJson(res, 404, { error: 'not_found' })
    }

    const donation = data as Donation
    const pdf = await buildReceiptPdf(donation, await getCampaignTitle(donation.campaign_id))

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${receiptFileName(donation)}"`)
    res.setHeader('Cache-Control', 'private, no-store')
    res.end(Buffer.from(pdf))
  } catch (error) {
    console.error('[receipts/pdf]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
