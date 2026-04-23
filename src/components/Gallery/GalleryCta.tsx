import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

function GalleryCta() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#f8fbfd] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('galleryPage.cta.eyebrow')}
          </p>
          <h2 className="mt-4 font-serif text-[2.5rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.3rem]">
            {t('galleryPage.cta.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#5f7280]">
            {t('galleryPage.cta.description')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="rounded-full bg-[#13703e] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
              to="/donate"
            >
              {t('common.actions.donateNow')}
            </Link>
            <Link
              className="rounded-full border border-[#c8dcea] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#abcbe0] hover:bg-[#edf7fc]"
              to="/programs"
            >
              {t('galleryPage.cta.secondary')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default GalleryCta
