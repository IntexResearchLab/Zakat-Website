import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { Donation, PaymentMethod } from './db.js'

// Builds the digital donation receipt as an A4 PDF. Organisation details mirror the
// registered information shown in the site footer and donation methods section.

const organisation = {
  name: 'Alokayon',
  registration: 'Registered with the Department of Social Services, Ministry of Social Welfare, Bangladesh (2019)',
  address: [
    'Holding No. 02, Road No. 10/1, Avenue 07, Block G, Ward 02,',
    'P.S. Khilgaon, Dhaka South City Corporation, Dhaka, Bangladesh',
  ],
  email: 'alokayon2019@gmail.com',
  phone: '01925124019',
}

export const categoryLabels: Record<string, string> = {
  default: 'Where most needed',
  zakat: 'Zakat',
  education: 'Education',
  healthcare: 'Healthcare',
  livelihood: 'Livelihood',
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  bkash: 'bKash',
  nagad: 'Nagad',
  bank: 'Bank transfer',
  cash: 'Cash',
  other: 'Other',
}

export const describePaymentMethod = (donation: Donation) => {
  if (donation.source === 'manual') {
    const method = donation.payment_method ? paymentMethodLabels[donation.payment_method] : 'Offline'
    return donation.reference ? `${method} (ref. ${donation.reference})` : method
  }

  return donation.card_type ? `${donation.card_type} via SSLCommerz` : 'Online via SSLCommerz'
}

const navy = rgb(0.078, 0.196, 0.302)
const green = rgb(0.075, 0.439, 0.243)
const muted = rgb(0.38, 0.45, 0.5)
const line = rgb(0.86, 0.9, 0.93)

// The standard PDF fonts only cover Latin characters, so anything else (e.g. a name typed
// in Bangla) is replaced rather than making the PDF fail to build.
const toPdfText = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\x20-\x7E]/g, '?')

export const formatAmount = (value: number) =>
  `BDT ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export const formatReceiptDate = (value: string | null) =>
  new Date(value ?? Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  })

const drawText = (
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color = navy,
) => page.drawText(toPdfText(text), { x, y, font, size, color })

export const describePurpose = (donation: Donation, campaignTitle?: string | null) => {
  const category = categoryLabels[donation.category] ?? donation.category
  return campaignTitle ? `${campaignTitle} (${category})` : category
}

export const buildReceiptPdf = async (donation: Donation, campaignTitle?: string | null) => {
  const pdf = await PDFDocument.create()
  pdf.setTitle(`Donation receipt ${donation.receipt_number ?? ''}`)
  pdf.setAuthor(organisation.name)

  const page = pdf.addPage([595.28, 841.89])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const { width } = page.getSize()
  const left = 56
  const right = width - 56

  // Header band
  page.drawRectangle({ x: 0, y: 760, width, height: 82, color: navy })
  drawText(page, organisation.name, left, 800, serif, 28, rgb(1, 1, 1))
  drawText(page, 'Serving underprivileged communities since 2011', left, 782, regular, 10, rgb(0.8, 0.86, 0.9))
  drawText(page, 'DONATION RECEIPT', right - bold.widthOfTextAtSize('DONATION RECEIPT', 12), 800, bold, 12, rgb(1, 1, 1))

  let y = 720
  drawText(page, 'Receipt number', left, y, regular, 10, muted)
  drawText(page, 'Date', 330, y, regular, 10, muted)
  y -= 18
  drawText(page, donation.receipt_number ?? '-', left, y, bold, 14)
  drawText(page, formatReceiptDate(donation.paid_at), 330, y, bold, 14)

  y -= 40
  drawText(page, 'Received with thanks from', left, y, regular, 10, muted)
  y -= 20
  drawText(page, donation.donor_name, left, y, serif, 20)
  y -= 16
  const contact = [donation.donor_email, donation.donor_phone].filter(Boolean).join('  |  ')
  if (contact) {
    drawText(page, contact, left, y, regular, 10, muted)
  }

  // Amount box
  y -= 58
  page.drawRectangle({ x: left, y: y - 24, width: right - left, height: 64, color: rgb(0.95, 0.98, 0.96), borderColor: rgb(0.8, 0.9, 0.84), borderWidth: 1 })
  drawText(page, 'Amount received', left + 18, y + 18, regular, 10, muted)
  drawText(page, formatAmount(Number(donation.paid_amount ?? donation.amount)), left + 18, y - 6, serif, 24, green)

  const rows: Array<[string, string]> = [
    ['Purpose', describePurpose(donation, campaignTitle)],
    ['Payment method', describePaymentMethod(donation)],
    [donation.source === 'manual' ? 'Record ID' : 'Transaction ID', donation.tran_id],
  ]

  y -= 64
  for (const [label, value] of rows) {
    page.drawLine({ start: { x: left, y: y + 14 }, end: { x: right, y: y + 14 }, thickness: 0.6, color: line })
    drawText(page, label, left, y, regular, 10, muted)
    drawText(page, value, 200, y, bold, 11)
    y -= 28
  }
  page.drawLine({ start: { x: left, y: y + 14 }, end: { x: right, y: y + 14 }, thickness: 0.6, color: line })

  y -= 20
  const note = [
    'Thank you for your generosity. May Allah accept your zakat and donations and reward you abundantly.',
    'Alokayon distributes donations directly to beneficiaries and publishes its reports in the annual magazine.',
  ]
  for (const text of note) {
    drawText(page, text, left, y, regular, 10, muted)
    y -= 15
  }

  y -= 25
  drawText(page, 'This is a computer-generated receipt and is valid without a signature.', left, y, regular, 9, muted)
  y -= 13
  drawText(
    page,
    donation.source === 'manual'
      ? 'For a hand-signed copy, please contact Alokayon using the details below.'
      : 'A hand-signed copy can be requested from the link in your receipt email.',
    left,
    y,
    regular,
    9,
    muted,
  )

  // Signature area, used when the client prints and signs a copy by hand.
  const signatureY = 170
  page.drawLine({ start: { x: right - 200, y: signatureY }, end: { x: right, y: signatureY }, thickness: 0.8, color: navy })
  drawText(page, 'Authorised signature', right - 200, signatureY - 14, regular, 9, muted)
  drawText(page, `For and on behalf of ${organisation.name}`, right - 200, signatureY - 27, regular, 9, muted)

  // Footer
  page.drawLine({ start: { x: left, y: 110 }, end: { x: right, y: 110 }, thickness: 0.6, color: line })
  let footerY = 94
  drawText(page, organisation.registration, left, footerY, regular, 8, muted)
  for (const addressLine of organisation.address) {
    footerY -= 12
    drawText(page, addressLine, left, footerY, regular, 8, muted)
  }
  footerY -= 12
  drawText(page, `${organisation.email}  |  ${organisation.phone}`, left, footerY, regular, 8, muted)

  return pdf.save()
}

export const receiptFileName = (donation: Donation) =>
  `Alokayon-receipt-${donation.receipt_number ?? donation.tran_id}.pdf`
