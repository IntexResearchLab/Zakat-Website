import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function SchoolCta() {
  const { t } = useTranslation()

  return (
    <section className="border-t border-[#dfe8ee] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdfe_55%,#f8fbfd_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-18 text-center sm:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('school.cta.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[0.98] tracking-[-0.05em] text-[#14324d] sm:text-[4rem]">
            {t('school.cta.title')}
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              href="#"
            >
              {t('school.cta.primary')}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f6fbff]"
              href="#"
            >
              {t('school.cta.secondary')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolCta
