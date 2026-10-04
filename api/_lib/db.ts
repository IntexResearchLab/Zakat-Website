import type { IncomingMessage } from 'node:http'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Server-only Supabase client. The service role key bypasses row level security,
// so it must never be given a VITE_ prefix or reach the browser bundle.

let serviceClient: SupabaseClient | null = null

export const getServiceClient = () => {
  if (serviceClient) {
    return serviceClient
  }

  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.')
  }

  serviceClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  return serviceClient
}

export type Donation = {
  id: string
  tran_id: string
  status: 'pending' | 'paid' | 'review' | 'failed' | 'cancelled'
  amount: number
  paid_amount: number | null
  currency: string
  category: string
  donor_name: string
  donor_email: string
  donor_phone: string
  card_type: string | null
  paid_at: string | null
  receipt_number: string | null
  receipt_token: string
  receipt_sent_at: string | null
  receipt_error: string | null
  signed_receipt_status: 'none' | 'requested' | 'sent'
  signed_receipt_requested_at: string | null
  signed_receipt_path: string | null
  signed_receipt_sent_at: string | null
  created_at: string
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const isUuid = (value: unknown): value is string =>
  typeof value === 'string' && uuidPattern.test(value)

// Admin endpoints receive the signed-in admin's access token and check it against admin_users.
export const requireAdmin = async (req: IncomingMessage) => {
  const header = String(req.headers.authorization ?? '')
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    return null
  }

  const client = getServiceClient()
  const { data, error } = await client.auth.getUser(token)

  if (error || !data.user) {
    return null
  }

  const { data: adminRow } = await client
    .from('admin_users')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  return adminRow ? data.user : null
}
