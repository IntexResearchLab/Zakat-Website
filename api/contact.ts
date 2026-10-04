import type { ServerResponse } from 'node:http'
import { createHmac } from 'node:crypto'
import { getServiceClient } from './_lib/db.js'
import { escapeHtml, layout, sendEmail } from './_lib/email.js'
import { getSiteUrl, readBody, sendJson, type ApiRequest } from './_lib/sslcommerz.js'

const topics = ['general', 'donation', 'zakat', 'volunteer', 'partnership', 'other']
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const maxPerHourFromOneSender = 5
// Above this many messages an hour from everyone together, messages are still saved for the
// inbox but the team is no longer emailed about each one, so a spam run cannot flood the mailbox.
const maxNoticesPerHour = 20
// Real people take a few seconds to fill in the form; most bots post immediately.
const minFillTimeMs = 3000

const clean = (value: unknown, maxLength: number) =>
  String(value ?? '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength)

const hashIp = (req: ApiRequest) => {
  const forwarded = String(req.headers['x-forwarded-for'] ?? '')
    .split(',')[0]
    .trim()
  const ip = forwarded || req.socket.remoteAddress || 'unknown'
  // Keyed with a server secret: a plain hash of an IPv4 address can be reversed by trying them all.
  const secret = process.env.CONTACT_IP_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createHmac('sha256', `alokayon-contact:${secret}`).update(ip).digest('hex').slice(0, 32)
}

// Saves a contact form message for the admin inbox and emails the team about it.
export default async function handler(req: ApiRequest, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'method_not_allowed' })
  }

  let body: Record<string, unknown>
  try {
    body = await readBody(req)
  } catch {
    return sendJson(res, 400, { error: 'invalid_request' })
  }

  // Spam traps: a hidden field people never see, and a form sent too fast. Bots get a normal
  // "sent" reply so they don't learn to work around the check.
  const startedAt = Number(body.startedAt)
  if (
    clean(body.website, 200) ||
    !Number.isFinite(startedAt) ||
    Date.now() - startedAt < minFillTimeMs
  ) {
    return sendJson(res, 200, { sent: true })
  }

  const name = clean(body.name, 80)
  const email = clean(body.email, 120)
  const phone = clean(body.phone, 20)
  const topic = topics.includes(String(body.topic)) ? String(body.topic) : 'general'
  const message = String(body.message ?? '')
    .trim()
    .slice(0, 4000)
  const language = clean(body.language, 5)

  if (!name || !emailPattern.test(email) || message.length < 10) {
    return sendJson(res, 400, { error: 'invalid_message' })
  }

  try {
    const client = getServiceClient()
    const ipHash = hashIp(req)
    const oneHourAgo = new Date(Date.now() - 3_600_000).toISOString()

    const { count } = await client
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', oneHourAgo)

    if ((count ?? 0) >= maxPerHourFromOneSender) {
      return sendJson(res, 429, { error: 'too_many' })
    }

    const { error } = await client.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      topic,
      message,
      language: language || null,
      ip_hash: ipHash,
    })

    if (error) {
      throw error
    }

    // The message is already saved, so a failed notification only means the team checks the inbox.
    const notifyTo = process.env.ADMIN_NOTIFY_EMAIL
    const { count: recentTotal } = await client
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneHourAgo)

    if (notifyTo && (recentTotal ?? 0) <= maxNoticesPerHour) {
      await sendEmail({
        to: notifyTo,
        replyTo: email,
        subject: `New message from ${name} (${topic}) – Alokayon website`,
        html: layout(`
<p style="margin-top:0"><strong>${escapeHtml(name)}</strong> sent a message through the website.</p>
<p style="color:#627581">${escapeHtml(email)}${phone ? ` · ${escapeHtml(phone)}` : ''} · Topic: ${escapeHtml(topic)}</p>
<div style="margin:18px 0;padding:16px;border-left:3px solid #115b82;background:#f4f8fb;white-space:pre-wrap">${escapeHtml(message)}</div>
<p>Reply to this email to answer ${escapeHtml(name)} directly, or open the inbox:
<a href="${escapeHtml(getSiteUrl(req))}/admin/messages">Admin → Messages</a></p>`),
      }).catch((notifyError) => console.error('[contact] notify failed', notifyError))
    }

    return sendJson(res, 200, { sent: true })
  } catch (error) {
    console.error('[contact]', error)
    return sendJson(res, 500, { error: 'unavailable' })
  }
}
