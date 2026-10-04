import type { ServerResponse } from 'node:http'
import {
  MAX_DONATION_BDT,
  MIN_DONATION_BDT,
  createPaymentSession,
  createTransactionId,
  getSiteUrl,
  readBody,
  sendJson,
  type ApiRequest,
} from '../_lib/sslcommerz.js'
import { getServiceClient } from '../_lib/db.js'

const allowedCategories = ['default', 'education', 'healthcare', 'livelihood']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const clean = (value: unknown, maxLength: number) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)

// Starts an SSLCommerz checkout and returns the hosted payment page URL.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  let body: Record<string, string>

  try {
    body = await readBody(req)
  } catch {
    return sendJson(res, 400, { error: 'invalid_request' })
  }

  const amount = Math.round(Number(body.amount) * 100) / 100
  const name = clean(body.name, 80)
  const email = clean(body.email, 120)
  const phone = clean(body.phone, 20)
  const category = allowedCategories.includes(body.category) ? body.category : 'default'
  const wantsSignedReceipt = String(body.signedReceipt) === 'true'

  if (!Number.isFinite(amount) || amount < MIN_DONATION_BDT || amount > MAX_DONATION_BDT) {
    return sendJson(res, 400, { error: 'invalid_amount' })
  }

  if (!name || !emailPattern.test(email) || phone.replace(/\D/g, '').length < 10) {
    return sendJson(res, 400, { error: 'invalid_donor' })
  }

  const transactionId = createTransactionId()

  try {
    // Record the donation before payment so the confirmation can be matched and receipted.
    const { error } = await getServiceClient()
      .from('donations')
      .insert({
        tran_id: transactionId,
        amount,
        category,
        donor_name: name,
        donor_email: email,
        donor_phone: phone,
        signed_receipt_status: wantsSignedReceipt ? 'requested' : 'none',
        signed_receipt_requested_at: wantsSignedReceipt ? new Date().toISOString() : null,
      })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('[payment/init] could not record donation', error)
    return sendJson(res, 503, { error: 'unavailable' })
  }

  try {
    const gatewayUrl = await createPaymentSession({
      amount,
      transactionId,
      name,
      email,
      phone,
      category,
      siteUrl: getSiteUrl(req),
    })

    return sendJson(res, 200, { url: gatewayUrl })
  } catch (error) {
    console.error('[payment/init]', error)
    return sendJson(res, 502, { error: 'gateway_unavailable' })
  }
}
