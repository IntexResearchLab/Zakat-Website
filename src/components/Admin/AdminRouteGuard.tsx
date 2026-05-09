import type { Session } from '@supabase/supabase-js'
import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../utils/supabase'

type AdminRouteGuardProps = {
  children: ReactNode
  mode: 'guest' | 'protected'
}

function AdminRouteGuard({ children, mode }: AdminRouteGuardProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession()

      if (isMounted) {
        setSession(activeSession)
        setIsLoading(false)
      }
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      setSession(activeSession)
      setIsLoading(false)
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

  if (mode === 'guest' && session) {
    return <Navigate replace to="/admin/dashboard" />
  }

  return <>{children}</>
}

export default AdminRouteGuard
