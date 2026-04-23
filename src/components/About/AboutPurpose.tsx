import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getImpactStats } from './data'

function AboutPurpose() {
  const { t } = useTranslation()
  const impactStats = getImpactStats(t)

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('about.purpose.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.2rem]">
            {t('about.purpose.title')}
          </h2>
          <div className="mx-auto mt-8 max-w-4xl space-y-5 text-[1.06rem] leading-[1.85] text-[#516573] sm:text-[1.1rem]">
            <p>
              {t('about.purpose.paragraphOne')}
            </p>
            <p>
              {t('about.purpose.paragraphTwoPrefix')}{' '}
              <span className="text-[#8b9aa5]">{t('about.purpose.paragraphTwoEmphasis')}</span>
            </p>
          </div>
          <Link
            className="mt-8 inline-flex items-center gap-3 text-[0.95rem] font-bold uppercase tracking-[0.16em] text-[#115b82] underline decoration-[#b8d0de] decoration-1 underline-offset-[6px] transition hover:gap-4"
            to="/about#about-journey"
          >
            {t('common.actions.readOurStory')}
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </Reveal>
        <Reveal className="mt-14" delay={100}>
          <div className="mx-auto max-w-5xl border-t border-[#d9e6ee] pt-10">
            <div className="grid gap-y-10 text-left md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-16">
              {impactStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-[2.7rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3.3rem]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[0.9rem] font-semibold tracking-[0.02em] text-[#697b86]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutPurpose
