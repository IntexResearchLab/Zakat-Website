import type { ServerResponse } from 'node:http'
import { getSiteUrl, readBody, redirect, type ApiRequest } from '../_lib/sslcommerz.js'
import { markDonationClosed } from '../_lib/donations.js'

export default async function handler(req: ApiRequest, res: ServerResponse) {
  const body = req.method === 'POST' ? await readBody(req).catch(() => ({}) as Record<string, string>) : {}
  await markDonationClosed(body.tran_id ?? '', 'cancelled')
  const query = body.tran_id ? `?tran_id=${encodeURIComponent(body.tran_id)}` : ''
  return redirect(res, `${getSiteUrl(req)}/donate/cancelled${query}`)
}
