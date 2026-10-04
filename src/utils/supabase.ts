import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL in environment variables.')
}

if (!supabasePublishableKey) {
  throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_KEY in environment variables.')
}

// Read before the client consumes the link: a password reset email lands with type=recovery
// in the URL. The reset page only accepts sessions that started this way.
let isRecoverySession = /(^|[#&?])type=recovery(&|$)/.test(window.location.hash + window.location.search)

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

supabase.auth.onAuthStateChange((event) => {
  if (event === 'PASSWORD_RECOVERY') {
    isRecoverySession = true
  } else if (event === 'SIGNED_OUT') {
    isRecoverySession = false
  }
})

export const hasRecoverySession = () => isRecoverySession
