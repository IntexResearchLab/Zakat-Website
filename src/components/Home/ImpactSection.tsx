import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getHomeImpactStats, getHomeSignatureProgramStats } from '../../content/stats'
import { usePublicStats } from '../../lib/publicStats'

function ImpactSection() {
  const { t } = useTranslation()
  usePublicStats()
  const primaryImpactStats = getHomeImpactStats(t)
  const signaturePrograms = getHomeSignatureProgramStats(t)

  return (
    <section className="bg-[#f4f7f2] py-12 sm:py-14" id="home-impact">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-20">
        <Reveal className="max-w-md">
          <h2 className="text-[2.15rem] font-black leading-[1.05] tracking-[-0.04em] text-[#14324d] sm:text-[2.65rem]">
            {t('home.impact.title')}
          </h2>
          <p className="mt-5 max-w-[26rem] text-[0.98rem] leading-[1.65] text-[#6a786e]">
            {t('home.impact.description')}
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4"
            to="/transparency"
          >
            {t('common.actions.readOurMagazine')}
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </Reveal>

        <Reveal className="flex-1" delay={120}>
          <div className="border-t border-[#d8e5dd] pt-8">
            <div className="grid gap-y-8 text-left sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-10">
            {primaryImpactStats.map((stat) => (
              <div className="hover-lift-soft" key={stat.label}>
                <p className="font-serif text-[2.45rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[2.9rem]">
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-[0.92rem] font-semibold tracking-[0.02em] text-[#697b86]">
                  {stat.label}
                </p>
              </div>
            ))}
            </div>
          </div>

          <div className="mt-7 border-t border-[#d8e5dd] pt-6">
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('home.impact.programsTitle')}
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {signaturePrograms.map((program) => (
                <Link
                  className="group rounded-lg bg-white/85 px-5 py-5 ring-1 ring-[#d7e5dc] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(20,50,77,0.1)]"
                  key={program.title}
                  to={program.href}
                >
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined rounded-full bg-[#e9f2ec] p-3 text-[1.3rem] text-[#115b82]">
                      {program.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3 className="font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                          {program.title}
                        </h3>
                        <span className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#115b82]">
                          {program.microStat}
                        </span>
                      </div>
                      <p className="mt-2 max-w-[25rem] text-[0.94rem] leading-[1.6] text-[#627168]">
                        {program.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#14324d] transition group-hover:gap-3">
                        {program.cta}
                        <span aria-hidden="true" className="text-base leading-none">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ImpactSection
