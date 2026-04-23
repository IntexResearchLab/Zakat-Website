import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../components/reusables/Reveal'
import type { MagazineIssue } from '../components/Transparency/types'

function TransparencyReader() {
  const { year } = useParams()
  const { t } = useTranslation()
  const issues = t('transparency.issues', {
    returnObjects: true,
  }) as MagazineIssue[]
  const issue = issues.find((item) => item.year === year)

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
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72]"
              download
              href={issue.pdfUrl}
            >
              {t('transparency.reader.download')}
            </a>
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
