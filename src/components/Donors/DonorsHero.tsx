import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonorsHero() {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [{t('common.breadcrumb.home')} /{' '}
            <span className="text-[#c58b16]">{t('common.breadcrumb.donors')}</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('donors.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#101d2b] sm:text-[4.2rem]">
            {t('donors.hero.title')}
          </h1>
          <p className="mt-7 max-w-[38rem] text-[1.05rem] leading-[1.85] text-[#5d6d78] sm:text-[1.08rem]">
            {t('donors.hero.description')}
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
              {t('donors.hero.secondaryCta')}
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <img
                alt={t('donors.hero.imageAlt')}
                className="aspect-[5/4] w-full object-cover"
                src="/assets/about/Donation.jpg"
              />
            </div>

            <div className="absolute bottom-5 left-5 rounded-[1.1rem] border border-white/70 bg-white/88 px-5 py-4 shadow-[0_14px_32px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:bottom-6 sm:left-6">
              <p className="text-[0.76rem] font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('donors.hero.floatingCard.eyebrow')}
              </p>
              <p className="mt-2 font-serif text-[1.55rem] leading-none tracking-[-0.04em] text-[#14324d]">
                {t('donors.hero.floatingCard.value')}
              </p>
              <p className="mt-2 max-w-[11rem] text-[0.86rem] leading-[1.55] text-[#61737f]">
                {t('donors.hero.floatingCard.label')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsHero
