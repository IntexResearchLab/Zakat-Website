import type { IncomingMessage, ServerResponse } from 'node:http'

// Server-side helpers for the SSLCommerz payment gateway.
// Credentials come from environment variables only and must never reach the browser bundle.

export type ApiRequest = IncomingMessage & { body?: unknown }

export const MIN_DONATION_BDT = 10
export const MAX_DONATION_BDT = 500000

type GatewayConfig = {
  storeId: string
  storePassword: string
  baseUrl: string
}

export const getGatewayConfig = (): GatewayConfig => {
  const storeId = process.env.SSLCOMMERZ_STORE_ID
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD

  if (!storeId || !storePassword) {
    throw new Error('SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD must be set.')
  }

  const isSandbox = process.env.SSLCOMMERZ_SANDBOX === 'true'

  return {
    storeId,
    storePassword,
    baseUrl: isSandbox ? 'https://sandbox.sslcommerz.com' : 'https://securepay.sslcommerz.com',
  }
}

// Callback URLs and receipt email links must point at the public site. The request's Host header
// is only trusted for local development: anywhere else a forged header could send donors elsewhere.
export const getSiteUrl = (req: IncomingMessage) => {
  const configured = process.env.SITE_URL?.replace(/\/+$/, '')

  if (configured) {
    return configured
  }

  const host = String(req.headers.host ?? '')

  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) {
    return `http://${host}`
  }

  // Set automatically by Vercel to the project's production domain.
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL

  if (vercelDomain) {
    return `https://${vercelDomain}`
  }

  // Redirects still work with a relative address; absolute links will fail until SITE_URL is set.
  console.error('[site-url] SITE_URL is not set')
  return ''
}

const readRawBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
      if (data.length > 100_000) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => resolve(data))
    req.on('error', reject)
  })

// Vercel pre-parses JSON and form bodies into req.body; the local dev server does not.
export const readBody = async (req: ApiRequest): Promise<Record<string, string>> => {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, string>
  }

  const raw = typeof req.body === 'string' ? req.body : await readRawBody(req)
  const contentType = String(req.headers['content-type'] ?? '')

  if (contentType.includes('application/json')) {
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  }

  return Object.fromEntries(new URLSearchParams(raw))
}

export const sendJson = (res: ServerResponse, status: number, payload: unknown) => {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

// 303 turns the gateway's POST callback into a normal GET page load in the browser.
export const redirect = (res: ServerResponse, location: string) => {
  res.statusCode = 303
  res.setHeader('Location', location)
  res.setHeader('Cache-Control', 'no-store')
  res.end()
}

export const createTransactionId = () => {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `ALK${Date.now()}${random}`
}

type SessionInput = {
  amount: number
  transactionId: string
  name: string
  email: string
  phone: string
  category: string
  siteUrl: string
}

type SessionResponse = {
  status?: string
  failedreason?: string
  GatewayPageURL?: string
}

export const createPaymentSession = async (input: SessionInput) => {
  const config = getGatewayConfig()
  const params = new URLSearchParams({
    store_id: config.storeId,
    store_passwd: config.storePassword,
    total_amount: input.amount.toFixed(2),
    currency: 'BDT',
    tran_id: input.transactionId,
    success_url: `${input.siteUrl}/api/payment/success`,
    fail_url: `${input.siteUrl}/api/payment/fail`,
    cancel_url: `${input.siteUrl}/api/payment/cancel`,
    ipn_url: `${input.siteUrl}/api/payment/ipn`,
    cus_name: input.name,
    cus_email: input.email,
    cus_phone: input.phone,
    cus_add1: 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    num_of_item: '1',
    product_name: 'Donation to Alokayon',
    product_category: 'Donation',
    product_profile: 'non-physical-goods',
    value_a: input.category,
  })

  const response = await fetch(`${config.baseUrl}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })

  const data = (await response.json()) as SessionResponse

  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(`SSLCommerz session failed: ${data.failedreason ?? 'unknown reason'}`)
  }

  return data.GatewayPageURL
}

export type ValidationResult = {
  status?: string
  tran_id?: string
  val_id?: string
  amount?: string
  currency?: string
  risk_level?: string
  card_type?: string
}

// Confirms with SSLCommerz that a payment notification is genuine.
export const validatePayment = async (valId: string) => {
  const config = getGatewayConfig()
  const params = new URLSearchParams({
    val_id: valId,
    store_id: config.storeId,
    store_passwd: config.storePassword,
    v: '1',
    format: 'json',
  })

  const response = await fetch(`${config.baseUrl}/validator/api/validationserverAPI.php?${params}`)
  return (await response.json()) as ValidationResult
}

export const isValidatedPayment = (result: ValidationResult, expectedTransactionId: string) =>
  (result.status === 'VALID' || result.status === 'VALIDATED') &&
  result.tran_id === expectedTransactionId &&
  result.currency === 'BDT'
