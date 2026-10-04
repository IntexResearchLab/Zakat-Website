import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TransparencyContents from '../components/Transparency/TransparencyContents'
import TransparencyAtAGlance from '../components/Transparency/TransparencyAtAGlance'
import TransparencyCta from '../components/Transparency/TransparencyCta'
import TransparencyDocuments from '../components/Transparency/TransparencyDocuments'
import TransparencyFinancialSnapshot from '../components/Transparency/TransparencyFinancialSnapshot'
import TransparencyHero from '../components/Transparency/TransparencyHero'
import TransparencyHighlights from '../components/Transparency/TransparencyHighlights'
import TransparencyMagazineLibrary from '../components/Transparency/TransparencyMagazineLibrary'
import type { MagazineIssue } from '../components/Transparency/types'
import {
  fetchMagazineRows,
  getCachedMagazineIssues,
  mapMagazineRowsToIssues,
} from '../lib/magazines'

function Transparency() {
  const { t } = useTranslation()
  // Recomputed when the language changes, so section names follow the selected language.
  const defaultSections = useMemo(
    () => t('transparency.defaultSections', { returnObjects: true }) as string[],
    [t],
  )
  const [loadedIssues, setIssues] = useState<MagazineIssue[]>(
    () => getCachedMagazineIssues(defaultSections) ?? [],
  )
  const issues = useMemo(
    () => loadedIssues.map((issue) => ({ ...issue, sections: defaultSections })),
    [loadedIssues, defaultSections],
  )
  const [isLoading, setIsLoading] = useState(issues.length === 0)
  const [hasError, setHasError] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    let isMounted = true
    const hasCachedIssues = issues.length > 0

    const loadIssues = async () => {
      if (!hasCachedIssues) {
        setIsLoading(true)
      }
      setHasError(false)

      const { data, error } = await fetchMagazineRows({
        forceRefresh: hasCachedIssues,
      })

      if (!isMounted) {
        return
      }

      if (error) {
        // The technical details go to the console; visitors see a plain message.
        console.error('[transparency]', error.message)
        setHasError(!hasCachedIssues)
        setIsLoading(false)
        return
      }

      const nextIssues = mapMagazineRowsToIssues(data ?? [], defaultSections)
      setIssues(nextIssues)
      setSelectedYear((current) =>
        current && nextIssues.some((issue) => issue.year === current)
          ? current
          : nextIssues[0]?.year || '',
      )
      setIsLoading(false)
    }

    loadIssues()

    return () => {
      isMounted = false
    }
    // We intentionally load once here.
    // If cached data exists, we render it immediately and refresh quietly in the background.
    // Re-running this effect on derived values was causing visible loading flicker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedIssue = useMemo(
    () => issues.find((issue) => issue.year === selectedYear) ?? issues[0],
    [issues, selectedYear],
  )

  if (isLoading) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.states.loading')}
          </p>
        </div>
      </section>
    )
  }

  if (hasError) {
    return (
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9e3342]">
            {t('transparency.states.errorTitle')}
          </p>
          <p className="mt-4 text-[1rem] leading-[1.8] text-[#647783]">
            {t('transparency.states.errorDescription')}
          </p>
        </div>
      </section>
    )
  }

  if (!selectedIssue) {
    // No magazines published yet: explain that, but keep the rest of the transparency page.
    return (
      <>
        <section className="bg-white py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('transparency.states.emptyTitle')}
            </p>
            <p className="mt-4 text-[1rem] leading-[1.8] text-[#5d6d78]">
              {t('transparency.states.emptyDescription')}
            </p>
          </div>
        </section>
        <TransparencyHighlights />
        <TransparencyFinancialSnapshot />
      </>
    )
  }

  return (
    <>
      <TransparencyHero latestIssue={issues[0]} />
      <TransparencyHighlights />
      <TransparencyAtAGlance latestIssue={issues[0]} />
      <TransparencyMagazineLibrary
        isLoading={isLoading}
        issues={issues}
        onSelectYear={setSelectedYear}
        selectedIssue={selectedIssue}
      />
      <TransparencyContents selectedIssue={selectedIssue} />
      <TransparencyDocuments selectedIssue={selectedIssue} />
      <TransparencyFinancialSnapshot />
      <TransparencyCta latestIssue={issues[0]} />
    </>
  )
}

export default Transparency
