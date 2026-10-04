import { getServiceClient, type Donation } from './db.js'
import { sendReceiptEmail } from './email.js'
import type { ValidationResult } from './sslcommerz.js'

// Both the browser redirect (success) and the server notification (IPN) confirm payments.
// Whichever arrives first moves the row out of an open status; the other finds nothing to update,
// so each donation is recorded and receipted exactly once.
const openStatuses = ['pending', 'failed', 'cancelled']

export const findDonationByTranId = async (tranId: string) => {
  const { data, error } = await getServiceClient()
    .from('donations')
    .select('*')
    .eq('tran_id', tranId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as Donation | null
}

// Emails the digital receipt and records whether it went out, so the admin can resend failures.
export const deliverReceipt = async (donation: Donation, siteUrl: string) => {
  const client = getServiceClient()

  try {
    await sendReceiptEmail(donation, siteUrl)
    const sentAt = new Date().toISOString()
    await client
      .from('donations')
      .update({ receipt_sent_at: sentAt, receipt_error: null })
      .eq('id', donation.id)
    return { donation: { ...donation, receipt_sent_at: sentAt, receipt_error: null }, sent: true }
  } catch (error) {
    console.error('[receipt] email failed', donation.tran_id, error)
    const receiptError = String(error).slice(0, 500)
    await client.from('donations').update({ receipt_error: receiptError }).eq('id', donation.id)
    return { donation: { ...donation, receipt_error: receiptError }, sent: false }
  }
}

export const confirmDonation = async (
  validation: ValidationResult,
  tranId: string,
  siteUrl: string,
) => {
  const donation = await findDonationByTranId(tranId)

  if (!donation) {
    console.warn('[donations] validated payment has no donation row', tranId)
    return null
  }

  const paidAmount = Number(validation.amount)
  const amountMatches = Math.abs(paidAmount - Number(donation.amount)) < 0.01
  // Held for a manual check when the amount differs or SSLCommerz flags the payment as risky.
  const status = amountMatches && validation.risk_level !== '1' ? 'paid' : 'review'

  const { data: updated, error } = await getServiceClient()
    .from('donations')
    .update({
      status,
      paid_amount: Number.isFinite(paidAmount) ? paidAmount : null,
      val_id: validation.val_id ?? null,
      card_type: validation.card_type ?? null,
      risk_level: validation.risk_level ?? null,
      paid_at: new Date().toISOString(),
    })
    .eq('id', donation.id)
    .in('status', openStatuses)
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!updated) {
    return donation
  }

  if (!amountMatches) {
    console.warn('[donations] amount mismatch', tranId, donation.amount, validation.amount)
  }

  if (updated.status !== 'paid') {
    return updated as Donation
  }

  return (await deliverReceipt(updated as Donation, siteUrl)).donation
}

export const markDonationClosed = async (tranId: string, status: 'failed' | 'cancelled') => {
  if (!tranId) {
    return
  }

  try {
    await getServiceClient()
      .from('donations')
      .update({ status })
      .eq('tran_id', tranId)
      .eq('status', 'pending')
  } catch (error) {
    console.error('[donations] could not mark', status, tranId, error)
  }
}
