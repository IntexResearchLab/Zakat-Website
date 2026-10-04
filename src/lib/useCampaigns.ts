import { useEffect, useState } from 'react'
import { getCachedCampaigns, loadCampaigns, type Campaign } from './campaigns'

// Loads campaigns once per visit; pages opened later reuse the cached list straight away.
export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(() => getCachedCampaigns())
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    loadCampaigns()
      .then((rows) => {
        if (isMounted) {
          setCampaigns(rows)
        }
      })
      .catch((error: unknown) => {
        console.error('[campaigns]', error)
        if (isMounted) {
          setHasError(true)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { campaigns, isLoading: campaigns === null && !hasError, hasError }
}
