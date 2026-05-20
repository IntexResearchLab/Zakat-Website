import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue } from './types'
import { downloadFile } from '../../lib/download'

type TransparencyHeroProps = {
  latestIssue: MagazineIssue
}

function TransparencyHero({ latestIssue }: TransparencyHeroProps) {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top_left,rgba(225,240,249,0.85),rgba(250,253,255,1)_48%,rgba(255,255,255,1)_100%)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [{t('common.breadcrumb.home')} /{' '}
            <span className="text-[#c58b16]">{t('common.breadcrumb.transparency')}</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('transparency.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#101d2b] sm:text-[4.2rem]">
            {t('transparency.hero.title')}
          </h1>
          <p className="mt-7 max-w-[37rem] text-[1.05rem] leading-[1.85] text-[#5d6d78] sm:text-[1.08rem]">
            {t('transparency.hero.description')}
          </p>
          <p className="mt-5 text-[0.92rem] font-semibold leading-[1.7] text-[#6b7c87]">
            {t('transparency.hero.trustLine')}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              to={`/transparency/${latestIssue.year}`}
            >
              {t('transparency.hero.primaryCta')}
            </Link>
            <button
              className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f6fbff]"
              onClick={() =>
                void downloadFile(
                  latestIssue.pdfUrl,
                  `${latestIssue.title} ${latestIssue.year}.pdf`,
                )
              }
              type="button"
            >
              {t('transparency.hero.secondaryCta')}
            </button>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative rounded-[1.7rem] border border-[#d8e5ec] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.1)] sm:p-8">
            <div className="rounded-[1.25rem] bg-[#f4f9fc] p-6">
              <div className="flex aspect-[4/3] items-center justify-center rounded-[1rem] border border-[#dbe8ef] bg-white shadow-inner">
                {latestIssue.coverImageUrl ? (
                  <img
                    alt={latestIssue.title}
                    className="h-full w-full rounded-[1rem] object-cover"
                    src={latestIssue.coverImageUrl}
                  />
                ) : (
                  <div className="text-center">
                    <span className="material-symbols-outlined text-[4rem] text-[#115b82]">
                      picture_as_pdf
                    </span>
                    <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                      {latestIssue.year}
                    </p>
                    <p className="mx-auto mt-3 max-w-xs font-serif text-[2rem] leading-[1.05] tracking-[-0.04em] text-[#14324d]">
                      {latestIssue.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-5 right-5 rounded-[1rem] border border-white/80 bg-white/92 px-5 py-4 shadow-[0_16px_34px_rgba(15,23,42,0.12)] backdrop-blur-sm">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('transparency.hero.floatingLabel')}
              </p>
              <p className="mt-2 text-sm font-semibold text-[#5f7280]">
                {t('transparency.hero.floatingText')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyHero
