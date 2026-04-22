import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function ProgramsCta() {
  const { t } = useTranslation()

  return (
    <section className="border-t border-[#d7e3ea] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdfe_55%,#f8fbfd_100%)] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('programs.cta.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.7rem] leading-[0.93] tracking-[-0.045em] text-[#14324d] sm:text-[3.4rem]">
            {t('programs.cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1rem] leading-[1.8] text-[#647783] sm:text-[1.04rem]">
            {t('programs.cta.description')}
          </p>
          <div className="mx-auto mt-8 h-px w-28 bg-[#d9e6ee]" />
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              href="#"
            >
              {t('common.actions.donateNow')}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#cfe0ea] bg-white/80 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition hover:border-[#bdd6e4] hover:bg-white"
              href="#"
            >
              {t('common.actions.readMagazine')}
              <span aria-hidden="true" className="ml-3 text-lg leading-none">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsCta
