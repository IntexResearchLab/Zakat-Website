import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/reusables/Reveal'
import type { MagazineIssue } from '../components/Transparency/types'
import { downloadFile } from '../lib/download'
import {
  fetchMagazineRows,
  getCachedMagazineIssues,
  mapMagazineRowsToIssues,
} from '../lib/magazines'

function TransparencyReader() {
  const { year } = useParams()
  const { t } = useTranslation()
  const [defaultSections] = useState(
    () =>
      t('transparency.defaultSections', {
        returnObjects: true,
      }) as string[],
  )
  const [issues, setIssues] = useState<MagazineIssue[]>(
    () => getCachedMagazineIssues(defaultSections) ?? [],
  )
  const [isLoading, setIsLoading] = useState(issues.length === 0)
  const [hasError, setHasError] = useState(false)

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
        setHasError(true)
        setIsLoading(false)
        return
      }

      setIssues(mapMagazineRowsToIssues(data ?? [], defaultSections))
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

  const issue = issues.find((item) => item.year === year)

  if (isLoading) {
    return (
      <section className="bg-[#fbfdfe] py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.states.loading')}
          </p>
        </div>
      </section>
    )
  }

  if (hasError) {
    return <Navigate replace to="/transparency" />
  }

  if (!issue) {
    return <Navigate replace to="/transparency" />
  }

  return (
    <section className="bg-[#fbfdfe]">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
              [{t('common.breadcrumb.home')} /{' '}
              <span className="text-[#c58b16]">{t('common.breadcrumb.transparency')}</span> /{' '}
              <span className="text-[#c58b16]">{issue.year}</span>]
            </p>
            <h1 className="mt-6 font-serif text-[2.7rem] leading-[0.98] tracking-[-0.05em] text-[#14324d] sm:text-[3.6rem]">
              {issue.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[1rem] leading-[1.75] text-[#647783]">
              {t('transparency.reader.description')}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f6fbff]"
              to="/transparency"
            >
              {t('transparency.reader.back')}
            </Link>
            <button
              className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72]"
              onClick={() =>
                void downloadFile(issue.pdfUrl, `${issue.title} ${issue.year}.pdf`)
              }
              type="button"
            >
              {t('transparency.reader.download')}
            </button>
          </div>
        </Reveal>

        <Reveal className="mt-10 overflow-hidden rounded-[1.4rem] border border-[#d7e6ef] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]" delay={120}>
          <iframe
            className="h-[75vh] w-full"
            src={`${issue.pdfUrl}#toolbar=1&navpanes=0`}
            title={issue.title}
          />
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyReader
