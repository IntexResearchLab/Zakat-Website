/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  getCurrentStatsMap,
  getDefaultStatsMap,
  resetCurrentStatsMap,
  setCurrentStatsMap,
  type PublicStatsKey,
} from '../content/stats'
import { supabase } from '../utils/supabase'
import { readStorage, writeStorage, removeStorage } from './safeStorage'

type PublicStatsContextValue = {
  stats: Record<PublicStatsKey, string>
  isLoading: boolean
  errorMessage: string
  refreshStats: () => Promise<void>
}

type PublicStatsRow = {
  key: PublicStatsKey
  value: string
  is_active: boolean
}

const statsStorageKey = 'alokayon_public_stats_cache'

const PublicStatsContext = createContext<PublicStatsContextValue | null>(null)

const getCachedStats = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const cachedValue = readStorage(statsStorageKey)

  if (!cachedValue) {
    return null
  }

  try {
    return JSON.parse(cachedValue) as Record<PublicStatsKey, string>
  } catch {
    removeStorage(statsStorageKey)
    return null
  }
}

const cacheStats = (stats: Record<PublicStatsKey, string>) => {
  if (typeof window === 'undefined') {
    return
  }

  writeStorage(statsStorageKey, JSON.stringify(stats))
}

export const invalidatePublicStatsCache = () => {
  if (typeof window !== 'undefined') {
    removeStorage(statsStorageKey)
  }
  resetCurrentStatsMap()
}

export const PublicStatsProvider = ({ children }: { children: ReactNode }) => {
  const cachedStats = useMemo(() => getCachedStats(), [])
  const [stats, setStats] = useState<Record<PublicStatsKey, string>>(() => {
    if (cachedStats) {
      setCurrentStatsMap(cachedStats)
      return getCurrentStatsMap()
    }

    return getCurrentStatsMap()
  })
  const [isLoading, setIsLoading] = useState(cachedStats === null)
  const [errorMessage, setErrorMessage] = useState('')

  const refreshStats = async () => {
    const shouldShowLoader = !cachedStats && Object.keys(stats).length === 0
    if (shouldShowLoader) {
      setIsLoading(true)
    }
    setErrorMessage('')

    const { data, error } = await supabase
      .from('public_stats')
      .select('key, value, is_active')
      .eq('is_active', true)

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    const nextStats = ((data ?? []) as PublicStatsRow[]).reduce(
      (accumulator, row) => {
        if (row.is_active) {
          accumulator[row.key] = row.value
        }
        return accumulator
      },
      { ...getDefaultStatsMap() } as Record<PublicStatsKey, string>,
    )

    setCurrentStatsMap(nextStats)
    cacheStats(nextStats)
    setStats(getCurrentStatsMap())
    setIsLoading(false)
  }

  useEffect(() => {
    void refreshStats()
    // We intentionally warm the stats once for the app shell.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PublicStatsContext.Provider value={{ stats, isLoading, errorMessage, refreshStats }}>
      {children}
    </PublicStatsContext.Provider>
  )
}

export const usePublicStats = () => {
  const context = useContext(PublicStatsContext)

  if (!context) {
    throw new Error('usePublicStats must be used within PublicStatsProvider')
  }

  return context
}
