import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateHero() {
  const { t } = useTranslation()
  const trustItems = t('donate.hero.trustItems', { returnObjects: true }) as string[]

  return (
    <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(230,242,248,0.86),rgba(248,252,255,1)_54%,rgba(255,255,255,1)_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
          <Reveal className="max-w-3xl">
            <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
              [{t('common.breadcrumb.home')} / <span className="text-[#c58b16]">{t('common.breadcrumb.donate')}</span>]
            </p>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
              {t('donate.hero.eyebrow')}
            </p>
            <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.94] tracking-[-0.05em] text-[#101d2b] sm:text-[4.25rem]">
              {t('donate.hero.title')}
            </h1>
            <p className="mt-7 max-w-[40rem] text-[1.05rem] leading-[1.85] text-[#5d6d78] sm:text-[1.08rem]">
              {t('donate.hero.description')}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#13703e] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
                href="#donate-form"
              >
                {t('common.actions.donateNow')}
              </a>
              <a
                className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
                href="#donate-transparency"
              >
                {t('donate.hero.secondaryCta')}
              </a>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative">
              <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <img
                  alt={t('donate.hero.imageAlt')}
                  className="aspect-[5/4] w-full object-cover"
                  src="/assets/about/Donation.jpg"
                />
              </div>

              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                <img
                  alt={t('donate.hero.logoAlt')}
                  className="h-22 w-22 rounded-full border border-white/85 bg-white/96 object-contain p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:h-26 sm:w-26 sm:p-2"
                  src="/assets/about/Logo.png"
                />
              </div>

              <div className="absolute bottom-5 right-5 max-w-[13rem] rounded-[1.2rem] border border-white/70 bg-white/92 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:bottom-6 sm:right-6">
                <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {t('donate.hero.floatingCard.eyebrow')}
                </p>
                <p className="mt-2 font-serif text-[1.65rem] leading-none tracking-[-0.05em] text-[#14324d]">
                  {t('donate.hero.floatingCard.value')}
                </p>
                <p className="mt-2 text-[0.88rem] leading-[1.55] text-[#60727d]">
                  {t('donate.hero.floatingCard.text')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-10 grid gap-4 border-t border-[#d9e6ee] pt-8 sm:grid-cols-2 xl:grid-cols-4"
          delay={120}
        >
          {trustItems.map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <span className="material-symbols-outlined text-[1rem] text-[#2d8a57]">verified</span>
              <p className="text-[0.95rem] font-semibold leading-[1.65] text-[#536b7a]">{item}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonateHero
