import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function MissionSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#f9fdff] py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20">
        <Reveal className="relative">
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_18px_48px_rgba(15,23,42,0.12)] transition-transform duration-500 hover:translate-y-[-4px]">
            <img
              alt={t('home.mission.imageAlt')}
              className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-[1.03]"
              src="/assets/home/carousel-2.jpg"
            />
          </div>

          <div className="absolute bottom-[-1.25rem] right-4 max-w-[16.5rem] rounded-[1.2rem] bg-[#ffe39a] px-7 py-6 shadow-[0_18px_40px_rgba(245,158,11,0.14)] transition-transform duration-500 hover:translate-y-[-3px] sm:bottom-[-1.5rem] sm:right-6">
            <p className="font-serif text-[1.05rem] italic leading-[1.45] text-[#7d6620] sm:text-[1.15rem]">
              &quot;{t('home.mission.quote')}&quot;
            </p>
          </div>
        </Reveal>

        <Reveal className="max-w-[40rem]" delay={140}>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
            {t('home.mission.eyebrow')}
          </p>
          <h2 className="max-w-3xl font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.15rem] lg:text-[3.7rem]">
            {t('home.mission.title')}
          </h2>

          <div className="mt-10 max-w-[35rem] space-y-10 text-[1.02rem] leading-[1.7] text-[#5b6d7a] sm:text-[1.08rem]">
            <p className="max-w-[34rem]">
              {t('home.mission.paragraphOne')}
            </p>
            <p className="max-w-[34rem]">
              {t('home.mission.paragraphTwo')}
            </p>
          </div>

          <a
            className="hover-lift-soft mt-12 inline-flex items-center gap-4 rounded-full border border-[#c8dcea] bg-[#f3fbff] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82] transition hover:gap-5 hover:border-[#abcbe0] hover:bg-[#e8f5fc]"
            href="#"
          >
            {t('common.actions.learnMoreAboutUs')}
            <span aria-hidden="true" className="text-3xl leading-none">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default MissionSection
