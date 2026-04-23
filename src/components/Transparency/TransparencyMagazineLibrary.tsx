import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue } from './types'

type TransparencyMagazineLibraryProps = {
  issues: MagazineIssue[]
  selectedIssue: MagazineIssue
  onSelectYear: (year: string) => void
}

function TransparencyMagazineLibrary({
  issues,
  selectedIssue,
  onSelectYear,
}: TransparencyMagazineLibraryProps) {
  const { t } = useTranslation()
  const futureYears = ['2024', '2023', '2022']
  const availableYears = new Set(issues.map((issue) => issue.year))

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('transparency.library.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('transparency.library.title')}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {[...issues.map((issue) => issue.year), ...futureYears].map((year) => {
              const isAvailable = availableYears.has(year)
              return (
                <button
                  className={`rounded-full border px-5 py-2.5 text-[0.78rem] font-bold uppercase tracking-[0.16em] transition ${
                    year === selectedIssue.year
                      ? 'border-[#115b82] bg-[#115b82] text-white'
                      : isAvailable
                        ? 'border-[#dce7ee] bg-white text-[#627581] hover:border-[#bdd6e4] hover:bg-[#f5fafe]'
                        : 'cursor-not-allowed border-[#e3ebf1] bg-[#f4f7fa] text-[#9aaab4]'
                  }`}
                  disabled={!isAvailable}
                  key={year}
                  onClick={() => onSelectYear(year)}
                  type="button"
                >
                  {year}
                </button>
              )
            })}
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-8 rounded-[1.6rem] border border-[#d8e5ec] bg-white p-6 shadow-[0_18px_44px_rgba(15,23,42,0.06)] lg:grid-cols-[0.8fr_1.2fr] lg:p-8" delay={120}>
          <div className="rounded-[1.2rem] bg-[#f4f9fc] p-5">
            <div className="flex aspect-[4/5] items-center justify-center rounded-[1rem] border border-[#dbe8ef] bg-white text-center shadow-inner">
              <div>
                <span className="material-symbols-outlined text-[4rem] text-[#115b82]">
                  article
                </span>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                  {selectedIssue.year}
                </p>
                <p className="mx-auto mt-3 max-w-[15rem] font-serif text-[2.1rem] leading-[1.05] tracking-[-0.04em] text-[#14324d]">
                  {selectedIssue.title}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('transparency.library.featuredLabel')}
            </p>
            <h3 className="mt-4 font-serif text-[2.35rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {selectedIssue.title}
            </h3>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783]">
              {selectedIssue.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {selectedIssue.sections.slice(0, 5).map((section) => (
                <span
                  className="rounded-full border border-[#d9e6ee] bg-[#fbfdfe] px-4 py-2 text-[0.78rem] font-semibold text-[#5f7280]"
                  key={section}
                >
                  {section}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
                to={`/transparency/${selectedIssue.year}`}
              >
                {t('transparency.library.readOnline')}
              </Link>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f6fbff]"
                download
                href={selectedIssue.pdfUrl}
              >
                {t('transparency.library.downloadPdf')}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyMagazineLibrary
