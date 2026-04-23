import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function MadrasaCta() {
  const { t } = useTranslation()

  return (
    <section className="border-t border-[#dde5de] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf9_55%,#f7f8f3_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-18 text-center sm:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            {t('madrasa.cta.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[0.98] tracking-[-0.05em] text-[#1f382a] sm:text-[4rem]">
            {t('madrasa.cta.title')}
          </h2>
          <p className="mx-auto mt-6 max-w-[42rem] text-[1.02rem] leading-[1.85] text-[#5f6d64]">
            {t('madrasa.cta.description')}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#2f6a52] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(47,106,82,0.18)] transition hover:bg-[#275843]"
              to="/donate"
            >
              {t('common.actions.donateNow')}
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-[#d6ddd7] bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6a52] transition hover:border-[#c4d2ca] hover:bg-[#f8fbf8]"
              to="/donate"
            >
              {t('common.actions.sponsorAStudent')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaCta
