import type { Session } from '@supabase/supabase-js'
import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../utils/supabase'

type AdminRouteGuardProps = {
  children: ReactNode
  mode: 'guest' | 'protected'
}

// Signing in is not enough: the account must also be listed in admin_users, because the
// dashboard shows donor contact details. The database enforces the same rule with RLS.
const checkIsAdmin = async (session: Session | null) => {
  if (!session) {
    return false
  }

  const { data } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return Boolean(data)
}

function AdminRouteGuard({ children, mode }: AdminRouteGuardProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let isMounted = true

    const applySession = async (activeSession: Session | null) => {
      const hasAccess = await checkIsAdmin(activeSession)

      if (isMounted) {
        setSession(activeSession)
        setIsAdmin(hasAccess)
        setIsLoading(false)
      }
    }

    const loadSession = async () => {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession()
      await applySession(activeSession)
    }

    void loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      // Supabase warns against awaiting other Supabase calls inside this callback.
      setTimeout(() => void applySession(activeSession), 0)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8fb] px-6 text-center text-[#4f6473]">
        <p className="text-sm font-semibold tracking-[0.08em]">
          {t('admin.auth.checkingAccess')}
        </p>
      </div>
    )
  }

  if (mode === 'protected' && !session) {
    return <Navigate replace to="/admin" />
  }

  if (mode === 'protected' && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8fb] px-6">
        <div className="max-w-md rounded-[1.4rem] border border-[#dbe7ee] bg-white p-8 text-center shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <h1 className="font-serif text-[1.9rem] leading-tight tracking-[-0.03em] text-[#14324d]">
            {t('admin.auth.notAdminTitle')}
          </h1>
          <p className="mt-3 text-[0.96rem] leading-[1.7] text-[#627581]">{t('admin.auth.notAdminMessage')}</p>
          <button
            className="mt-6 rounded-full bg-[#115b82] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72]"
            onClick={() => void supabase.auth.signOut()}
            type="button"
          >
            {t('admin.dashboard.signOut')}
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'guest' && session) {
    return <Navigate replace to="/admin/dashboard" />
  }

  return <>{children}</>
}

export default AdminRouteGuard
