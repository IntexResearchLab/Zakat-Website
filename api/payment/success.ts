import type { ServerResponse } from 'node:http'
import {
  getSiteUrl,
  isValidatedPayment,
  readBody,
  redirect,
  validatePayment,
  type ApiRequest,
} from '../_lib/sslcommerz.js'

// SSLCommerz posts here after a successful payment. The payment is only shown as
// successful once the Validation API confirms it.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  const siteUrl = getSiteUrl(req)

  try {
    const body = req.method === 'POST' ? await readBody(req) : {}
    const transactionId = body.tran_id ?? ''

    if (!body.val_id || !transactionId) {
      return redirect(res, `${siteUrl}/donate/failed`)
    }

    const validation = await validatePayment(body.val_id)

    if (!isValidatedPayment(validation, transactionId)) {
      console.warn('[payment/success] validation failed', transactionId, validation.status)
      return redirect(res, `${siteUrl}/donate/failed?tran_id=${encodeURIComponent(transactionId)}`)
    }

    const params = new URLSearchParams({
      tran_id: transactionId,
      amount: validation.amount ?? '',
    })

    // risk_level 1 means SSLCommerz wants the merchant to verify the donor before accepting.
    if (validation.risk_level === '1') {
      params.set('review', '1')
    }

    return redirect(res, `${siteUrl}/donate/success?${params}`)
  } catch (error) {
    console.error('[payment/success]', error)
    return redirect(res, `${siteUrl}/donate/failed`)
  }
}
