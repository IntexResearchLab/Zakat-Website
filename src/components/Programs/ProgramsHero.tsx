import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getProgramStats } from './data'
import { usePublicStats } from '../../lib/publicStats'

function ProgramsHero() {
  const { t } = useTranslation()
  usePublicStats()
  const programStats = getProgramStats(t)

  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <Reveal className="max-w-2xl">
            <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
              [{t('common.breadcrumb.home')} / <span className="text-[#c58b16]">{t('common.breadcrumb.programs')}</span>]
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
              {t('programs.hero.eyebrow')}
            </p>
            <h1 className="mt-5 max-w-[11ch] text-[3rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#101d2b] sm:text-[4.4rem]">
              {t('programs.hero.title')}
            </h1>
            <p className="mt-7 max-w-[34rem] text-[1.03rem] leading-[1.85] text-[#5d6d78] sm:text-[1.06rem]">
              {t('programs.hero.description')}
            </p>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative">
              <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <img
                  alt={t('programs.hero.imageAlt')}
                  className="aspect-[5/4] w-full object-cover"
                  src="/assets/home/volunteers-1.jpg"
                />
              </div>

              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <img
                  alt={t('programs.hero.logoAlt')}
                  className="h-22 w-22 rounded-full border border-white/85 bg-white/96 object-contain p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:h-26 sm:w-26 sm:p-2"
                  src="/assets/about/Logo.png"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-10 grid gap-6 border-t border-[#d9e6ee] pt-8 sm:grid-cols-2 xl:grid-cols-4"
          delay={120}
        >
          {programStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-[2.5rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.9rem] font-semibold tracking-[0.02em] text-[#697b86]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsHero
