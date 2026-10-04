import { supabase } from '../utils/supabase'

export type PaymentMethod = 'bkash' | 'nagad' | 'bank' | 'cash' | 'other'

export const paymentMethods: PaymentMethod[] = ['bkash', 'nagad', 'bank', 'cash', 'other']

export const donationCategories = [
  'default',
  'zakat',
  'education',
  'healthcare',
  'livelihood',
] as const

export type AdminDonation = {
  id: string
  tran_id: string
  status: 'pending' | 'paid' | 'review' | 'failed' | 'cancelled'
  source: 'online' | 'manual'
  amount: number
  paid_amount: number | null
  category: string
  donor_name: string
  donor_email: string | null
  donor_phone: string | null
  card_type: string | null
  payment_method: PaymentMethod | null
  reference: string | null
  notes: string | null
  recorded_by: string | null
  campaign_id: string | null
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

type AdminApiResult = {
  ok: boolean
  status: number
  donation?: AdminDonation
  emailed?: boolean
  error?: string
}

// Calls an admin API function with the signed-in admin's access token.
export const callAdminApi = async (
  path: string,
  payload: Record<string, unknown>,
): Promise<AdminApiResult> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token ?? ''}`,
      },
      body: JSON.stringify(payload),
    })
    const data = (await response.json().catch(() => ({}))) as Omit<AdminApiResult, 'ok' | 'status'>

    return { ok: response.ok, status: response.status, ...data }
  } catch {
    return { ok: false, status: 0, error: 'network' }
  }
}
