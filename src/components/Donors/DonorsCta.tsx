import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonorsCta() {
  const { t } = useTranslation()

  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(237,246,251,1),rgba(248,252,255,1)_56%,rgba(255,255,255,1)_100%)] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('donors.cta.eyebrow')}
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-serif text-[2.65rem] leading-[0.98] tracking-[-0.05em] text-[#14324d] sm:text-[3.6rem]">
            {t('donors.cta.title')}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-[1rem] leading-[1.85] text-[#5f7280] sm:text-[1.04rem]">
            {t('donors.cta.description')}
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
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
              {t('donors.cta.secondary')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsCta
