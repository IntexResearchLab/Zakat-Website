import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function AboutHero() {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [{t('common.breadcrumb.home')} / <span className="text-[#c58b16]">{t('common.breadcrumb.aboutUs')}</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('about.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-[11ch] text-[3rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#101d2b] sm:text-[4.35rem]">
            {t('about.hero.title')}
          </h1>
          <p className="mt-8 max-w-[30rem] text-[1.03rem] leading-[1.9] text-[#5d6d78] sm:text-[1.06rem]">
            {t('about.hero.description')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              href="#"
            >
              {t('common.actions.donateNow')}
            </a>
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
              href="#"
            >
              {t('common.actions.viewPrograms')}
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <img
                alt={t('about.hero.imageAlt')}
                className="aspect-[5/4] w-full object-cover"
                src="/assets/about/Donation.jpg"
              />
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <img
                alt={t('about.hero.logoAlt')}
                className="h-22 w-22 rounded-full border border-white/85 bg-white/96 object-contain p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:h-26 sm:w-26 sm:p-2"
                src="/assets/about/Logo.png"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutHero
