import type { Donation } from './db.js'
import {
  buildReceiptPdf,
  categoryLabels,
  describePaymentMethod,
  formatAmount,
  formatReceiptDate,
  receiptFileName,
} from './receipt.js'

// Sends email through the Resend API (https://resend.com/docs/api-reference/emails/send-email).

type Attachment = { filename: string; content: Uint8Array | Buffer }

type EmailInput = {
  to: string
  subject: string
  html: string
  attachments?: Attachment[]
}

export const sendEmail = async ({ to, subject, html, attachments = [] }: EmailInput) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RECEIPT_FROM_EMAIL

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and RECEIPT_FROM_EMAIL must be set.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: process.env.RECEIPT_REPLY_TO || undefined,
      subject,
      html,
      attachments: attachments.map((file) => ({
        filename: file.filename,
        content: Buffer.from(file.content).toString('base64'),
      })),
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`)
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

const layout = (body: string) => `<!doctype html>
<html><body style="margin:0;background:#f4f8fb;font-family:Arial,Helvetica,sans-serif;color:#14324d">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #dbe7ee;border-radius:16px;overflow:hidden">
<tr><td style="background:#14324d;padding:24px 28px;color:#ffffff;font-family:Georgia,serif;font-size:26px">Alokayon</td></tr>
<tr><td style="padding:28px;font-size:15px;line-height:1.7;color:#3f5462">${body}</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e4edf3;font-size:12px;line-height:1.6;color:#627581">
Alokayon &middot; Registered with the Department of Social Services, Bangladesh (2019)<br>
alokayon2019@gmail.com &middot; 01925124019
</td></tr>
</table>
</td></tr>
</table>
</body></html>`

const detailRow = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;color:#627581">${label}</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#14324d">${escapeHtml(value)}</td></tr>`

const button = (href: string, label: string) =>
  `<a href="${escapeHtml(href)}" style="display:inline-block;background:#13703e;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">${label}</a>`

const donationSummary = (donation: Donation) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-top:1px solid #e4edf3;border-bottom:1px solid #e4edf3;font-size:14px">
${detailRow('Receipt number', donation.receipt_number ?? '-')}
${detailRow('Amount', formatAmount(Number(donation.paid_amount ?? donation.amount)))}
${detailRow('Purpose', categoryLabels[donation.category] ?? donation.category)}
${detailRow('Date', formatReceiptDate(donation.paid_at))}
${detailRow('Payment method', describePaymentMethod(donation))}
${detailRow(donation.source === 'manual' ? 'Record ID' : 'Transaction ID', donation.tran_id)}
</table>`

export const receiptPageUrl = (siteUrl: string, donation: Donation) =>
  `${siteUrl}/donate/receipt?ref=${donation.receipt_token}`

// The digital receipt, sent automatically once a payment is confirmed.
export const sendReceiptEmail = async (donation: Donation, siteUrl: string) => {
  if (!donation.donor_email) {
    throw new Error('This donation has no email address.')
  }

  const pdf = await buildReceiptPdf(donation)
  const signedNote =
    donation.signed_receipt_status === 'requested'
      ? '<p>You asked for a <strong>hand-signed receipt</strong>. Our team will sign it and email it to you shortly.</p>'
      : `<p>Need a hand-signed copy for your records? Request one below and our team will sign and email it to you.</p>
<p>${button(receiptPageUrl(siteUrl, donation), 'Request a signed receipt')}</p>`

  await sendEmail({
    to: donation.donor_email,
    subject: `Your donation receipt ${donation.receipt_number ?? ''} – Alokayon`,
    html: layout(`
<p style="font-size:18px;color:#14324d;margin-top:0">Dear ${escapeHtml(donation.donor_name)},</p>
<p>Thank you for your donation to Alokayon. May Allah accept it from you and reward you abundantly.</p>
${donationSummary(donation)}
<p>Your official receipt is attached as a PDF.</p>
${signedNote}`),
    attachments: [{ filename: receiptFileName(donation), content: pdf }],
  })
}

// Sent when the client uploads the scanned, hand-signed receipt in the admin dashboard.
export const sendSignedReceiptEmail = async (donation: Donation, file: Attachment) => {
  if (!donation.donor_email) {
    throw new Error('This donation has no email address.')
  }

  await sendEmail({
    to: donation.donor_email,
    subject: `Your signed donation receipt ${donation.receipt_number ?? ''} – Alokayon`,
    html: layout(`
<p style="font-size:18px;color:#14324d;margin-top:0">Dear ${escapeHtml(donation.donor_name)},</p>
<p>As requested, please find your hand-signed donation receipt attached.</p>
${donationSummary(donation)}
<p>Jazakallahu khairan for supporting our work.</p>`),
    attachments: [file],
  })
}

// Lets the client know a donor is waiting for a signed receipt.
export const sendSignedRequestNotice = async (donation: Donation, siteUrl: string) => {
  const to = process.env.ADMIN_NOTIFY_EMAIL

  if (!to) {
    return
  }

  await sendEmail({
    to,
    subject: `Signed receipt requested – ${donation.receipt_number ?? donation.tran_id}`,
    html: layout(`
<p style="margin-top:0"><strong>${escapeHtml(donation.donor_name)}</strong> (${escapeHtml(donation.donor_email ?? donation.donor_phone ?? 'no contact details')}) has asked for a hand-signed receipt.</p>
${donationSummary(donation)}
<p>${button(`${siteUrl}/admin/donations`, 'Open donations in the admin')}</p>`),
  })
}
