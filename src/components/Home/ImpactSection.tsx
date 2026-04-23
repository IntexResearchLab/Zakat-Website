import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function ImpactSection() {
  const { t } = useTranslation()
  const primaryImpactStats = t('home.impact.stats', {
    returnObjects: true,
  }) as Array<{ value: string; label: string }>

  return (
    <section className="bg-[#f4f7f2] py-12 sm:py-14" id="home-impact">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
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

        <Reveal
          className="grid flex-1 grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-10"
          delay={120}
        >
          {primaryImpactStats.map((stat) => (
            <div className="hover-lift-soft" key={stat.label}>
              <p className="font-serif text-[2.05rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[2.8rem]">
                {stat.value}
              </p>
              <p className="mt-3 max-w-[10rem] text-[0.82rem] leading-[1.4] text-[#6a786e]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ImpactSection
