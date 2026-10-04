import type { ServerResponse } from 'node:http'
import {
  getSiteUrl,
  isValidatedPayment,
  readBody,
  redirect,
  validatePayment,
  type ApiRequest,
} from '../_lib/sslcommerz.js'
import { confirmDonation } from '../_lib/donations.js'

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

    let validation
    try {
      validation = await validatePayment(body.val_id)
    } catch (error) {
      // SSLCommerz could not be reached, which says nothing about the payment itself. The donor may
      // have paid, so show "being verified" rather than a failure; the IPN confirms it later.
      console.error('[payment/success] validation unavailable', transactionId, error)
      const params = new URLSearchParams({ tran_id: transactionId, review: '1' })
      return redirect(res, `${siteUrl}/donate/success?${params}`)
    }

    if (!isValidatedPayment(validation, transactionId)) {
      console.warn('[payment/success] validation failed', transactionId, validation.status)
      return redirect(res, `${siteUrl}/donate/failed?tran_id=${encodeURIComponent(transactionId)}`)
    }

    const params = new URLSearchParams({ tran_id: transactionId })

    // The payment is already confirmed, so a database or email problem must not show the donor
    // a failure page. The IPN retries the recording, and the admin can resend the receipt.
    try {
      const donation = await confirmDonation(validation, transactionId, siteUrl)
      if (donation) {
        params.set('ref', donation.receipt_token)
      }
    } catch (error) {
      console.error('[payment/success] could not record donation', transactionId, error)
    }

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
