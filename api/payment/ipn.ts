import type { ServerResponse } from 'node:http'
import {
  isValidatedPayment,
  readBody,
  sendJson,
  validatePayment,
  type ApiRequest,
} from '../_lib/sslcommerz.js'

// Instant Payment Notification listener. SSLCommerz calls this server-to-server even if the
// donor closes the browser, so this is the reliable record that a payment completed.
// Configure it in the SSLCommerz Merchant Panel: My Store > IPN Settings.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  try {
    const body = await readBody(req)

    if (!body.val_id || !body.tran_id) {
      console.info('[payment/ipn] non-success notification', body.tran_id, body.status)
      return sendJson(res, 200, { received: true })
    }

    const validation = await validatePayment(body.val_id)
    const isValid = isValidatedPayment(validation, body.tran_id)

    console.info('[payment/ipn]', {
      tran_id: body.tran_id,
      status: validation.status,
      amount: validation.amount,
      risk_level: validation.risk_level,
      valid: isValid,
    })

    return sendJson(res, 200, { received: true, valid: isValid })
  } catch (error) {
    console.error('[payment/ipn]', error)
    return sendJson(res, 500, { error: 'ipn_processing_failed' })
  }
}
