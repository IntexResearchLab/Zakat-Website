import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getTimeline } from './data'

function AboutJourney() {
  const { t } = useTranslation()
  const timeline = getTimeline(t)

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24" id="about-journey">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('about.journey.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
              {t('about.journey.title')}
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783] sm:text-[1.04rem]">
              {t('about.journey.description')}
            </p>
          </div>
        </Reveal>

        <Reveal
          className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_26rem] lg:items-start lg:gap-4"
          delay={100}
        >
          <div className="relative pl-8 sm:pl-10">
            <div className="absolute bottom-3 left-[0.42rem] top-3 w-px bg-[#d5e1e8] sm:left-[0.52rem]" />
            <div className="space-y-10">
              {timeline.map((item) => (
                <div className="relative" key={item.year}>
                  <div className="absolute left-[-2rem] top-2.5 h-4 w-4 rounded-full border-4 border-[#f7fbfd] bg-[#115b82] shadow-[0_0_0_1px_#d5e1e8] sm:left-[-2.5rem]" />
                  <p className="text-[1.05rem] font-bold tracking-[0.08em] text-[#115b82]">
                    {item.year}
                  </p>
                  <p className="mt-2 font-serif text-[1.6rem] leading-[1.18] tracking-[-0.03em] text-[#14324d] sm:text-[1.78rem]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[26rem] rounded-[1rem] border border-[#dce7ee] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] lg:-ml-14 xl:-ml-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5ed] bg-[#f8fcfe] px-3 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
              <span className="material-symbols-outlined text-[1rem]">
                verified
              </span>
              {t('about.journey.badge')}
            </div>
            <p className="mt-4 text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#14324d]">
              {t('about.journey.registrationTitle')}
            </p>
            <p className="mt-2 max-w-[22rem] text-[0.92rem] leading-[1.65] text-[#657783]">
              {t('about.journey.registrationDescription')}
            </p>

            <div className="mt-4 rounded-[0.9rem] border border-[#e2ebf1] bg-[linear-gradient(180deg,#f8fbfd_0%,#f4f8fb_100%)] px-3 py-3">
              <div className="mx-auto max-w-[15rem] rotate-[-4deg] overflow-hidden rounded-[0.75rem] border border-[#d9e5ec] bg-white shadow-[0_14px_28px_rgba(15,23,42,0.12)] transition-transform duration-300 hover:rotate-0">
                <img
                  alt={t('about.journey.certificateAlt')}
                  className="max-h-[9rem] w-full object-contain"
                  src="/assets/about/Certificate.png"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutJourney
