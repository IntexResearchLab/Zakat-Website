import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function SchoolTeacherSpotlight() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-18">
        <Reveal>
          <div className="overflow-hidden rounded-[1.8rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <img
              alt={t('school.teacher.imageAlt')}
              className="aspect-[4/5] w-full object-cover"
              src="/assets/about/person-1.jpg"
            />
          </div>
        </Reveal>

        <Reveal className="max-w-2xl" delay={120}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('school.teacher.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.45rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            {t('school.teacher.title')}
          </h2>
          <p className="mt-7 text-[1.02rem] leading-[1.9] text-[#5f7280]">
            {t('school.teacher.paragraphOne')}
          </p>
          <p className="mt-5 text-[1.02rem] leading-[1.9] text-[#5f7280]">
            {t('school.teacher.paragraphTwo')}
          </p>

          <div className="mt-8 rounded-[1.4rem] border border-[#dbe7ee] bg-[#fbfdff] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="font-serif text-[1.55rem] leading-[1.45] tracking-[-0.03em] text-[#14324d] sm:text-[1.8rem]">
              “{t('school.teacher.quote')}”
            </p>
            <div className="mt-5 border-t border-[#dde8ef] pt-4">
              <p className="text-[1rem] font-semibold text-[#14324d]">{t('school.teacher.name')}</p>
              <p className="mt-1 text-[0.96rem] text-[#5f7280]">
                {t('school.teacher.role')}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolTeacherSpotlight
