import { useEffect, useState } from 'react'
import { getCachedUpdates, loadUpdates, type UpdateRecord } from './updates'

// Loads posts once per visit; pages opened later reuse the cached list straight away.
// Only published posts are returned, even to a signed-in admin.
export const useUpdates = () => {
  const [updates, setUpdates] = useState<UpdateRecord[] | null>(() => getCachedUpdates())
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadUpdates()
      .then((rows) => {
        if (isMounted) {
          setUpdates(rows)
        }
      })
      .catch((error: unknown) => {
        console.error('[updates]', error)
        if (isMounted) {
          setHasError(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    updates: updates?.filter((update) => update.is_published) ?? null,
    isLoading: updates === null && !hasError,
    hasError,
  }
}
