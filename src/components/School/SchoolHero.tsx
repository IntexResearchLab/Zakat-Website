import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function SchoolHero() {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [{t('common.breadcrumb.home')} / <span className="text-[#c58b16]">{t('common.breadcrumb.programs')}</span> /{' '}
            <span className="text-[#c58b16]">{t('common.breadcrumb.school')}</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('school.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#101d2b] sm:text-[4.2rem]">
            {t('school.hero.title')}
          </h1>
          <p className="mt-8 max-w-[34rem] text-[1.03rem] leading-[1.9] text-[#5d6d78] sm:text-[1.06rem]">
            {t('school.hero.description')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              href="#"
            >
              {t('common.actions.supportAChild')}
            </a>
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
              href="#school-gallery"
            >
              {t('common.actions.viewSchoolGallery')}
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <img
                alt={t('school.hero.imageAlt')}
                className="aspect-[5/4] w-full object-cover"
                src="/assets/home/carousel-1.jpg"
              />
            </div>

            <div className="absolute bottom-5 right-5 rounded-[1.1rem] border border-white/80 bg-white/92 px-5 py-4 shadow-[0_18px_38px_rgba(15,23,42,0.14)] backdrop-blur-sm">
              <p className="font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
                {t('school.hero.floatingStat.value')}
              </p>
              <p className="mt-2 max-w-[10rem] text-sm font-semibold leading-[1.5] text-[#5f7280]">
                {t('school.hero.floatingStat.label')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolHero
