import type { ServerResponse } from 'node:http'
import { randomBytes } from 'node:crypto'
import {
  getServiceClient,
  isUuid,
  paymentMethods,
  requireAdmin,
  type Donation,
  type PaymentMethod,
} from '../../_lib/db.js'
import { deliverReceipt } from '../../_lib/donations.js'
import { MAX_DONATION_BDT, getSiteUrl, readBody, sendJson, type ApiRequest } from '../../_lib/sslcommerz.js'

const allowedCategories = ['default', 'zakat', 'education', 'healthcare', 'livelihood']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

const clean = (value: unknown, maxLength: number) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)

// Admin: record a donation received outside the website (bKash, Nagad, bank transfer, cash).
// It is stored as paid straight away, so it gets a receipt number, and the receipt can be
// emailed when the donor gave an email address.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  try {
    const admin = await requireAdmin(req)

    if (!admin) {
      return sendJson(res, 401, { error: 'unauthorized' })
    }

    const body = (await readBody(req)) as Record<string, unknown>
    const amount = Math.round(Number(body.amount) * 100) / 100
    const name = clean(body.name, 80)
    const email = clean(body.email, 120)
    const phone = clean(body.phone, 20)
    const method = String(body.method) as PaymentMethod
    const category = allowedCategories.includes(String(body.category)) ? String(body.category) : 'default'
    const receivedOn = String(body.receivedOn ?? '')
    // Admins enter dates in Bangladesh time; UTC would reject today's date before 6 am there.
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })

    if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_DONATION_BDT * 20) {
      return sendJson(res, 400, { error: 'invalid_amount' })
    }
    if (!name) {
      return sendJson(res, 400, { error: 'invalid_name' })
    }
    if (email && !emailPattern.test(email)) {
      return sendJson(res, 400, { error: 'invalid_email' })
    }
    if (!paymentMethods.includes(method)) {
      return sendJson(res, 400, { error: 'invalid_method' })
    }
    // A future date is almost always a typo.
    if (!datePattern.test(receivedOn) || receivedOn > today) {
      return sendJson(res, 400, { error: 'invalid_date' })
    }

    const { data, error } = await getServiceClient()
      .from('donations')
      .insert({
        tran_id: `MAN${Date.now()}${randomBytes(3).toString('hex').toUpperCase()}`,
        status: 'paid',
        source: 'manual',
        amount,
        paid_amount: amount,
        category,
        donor_name: name,
        donor_email: email || null,
        donor_phone: phone || null,
        payment_method: method,
        reference: clean(body.reference, 80) || null,
        notes: clean(body.notes, 500) || null,
        recorded_by: admin.email ?? admin.id,
        // Noon in Dhaka, so the date shown on the receipt matches the date entered.
        paid_at: new Date(`${receivedOn}T12:00:00+06:00`).toISOString(),
        // Any campaign can be chosen here, so gifts received before or after it ran still count.
        campaign_id: isUuid(body.campaignId) ? body.campaignId : null,
      })
      .select('*')
      .single()

    if (error) {
      throw error
    }

    let donation = data as Donation
    let emailed = false

    if (body.sendReceipt === true && donation.donor_email) {
      const delivery = await deliverReceipt(donation, getSiteUrl(req))
      donation = delivery.donation
      emailed = delivery.sent
    }

    return sendJson(res, 200, { donation, emailed })
  } catch (error) {
    console.error('[admin/record-donation]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
