import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function SchoolWhyMatters() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-18 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('school.whyMatters.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.03] tracking-[-0.04em] text-[#14324d] sm:text-[3.3rem]">
            {t('school.whyMatters.title')}
          </h2>
          <p className="mx-auto mt-7 max-w-[46rem] text-[1.02rem] leading-[1.9] text-[#5f7280]">
            {t('school.whyMatters.paragraphOne')}
          </p>
          <p className="mx-auto mt-5 max-w-[46rem] text-[1.02rem] leading-[1.9] text-[#5f7280]">
            {t('school.whyMatters.paragraphTwo')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolWhyMatters
