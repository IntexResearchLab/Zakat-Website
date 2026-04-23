import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

function GalleryHero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-[#f9fcfe] py-18 sm:py-22">
      <div className="absolute inset-0 opacity-20">
        <img
          alt=""
          className="h-full w-full object-cover blur-[3px]"
          src="/assets/home/carousel-3.jpg"
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(249,252,254,0.97),rgba(238,247,251,0.9))]" />

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('galleryPage.hero.eyebrow')}
          </p>
          <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[2.75rem] leading-[0.96] tracking-[-0.04em] text-[#14324d] sm:text-[3.7rem]">
            {t('galleryPage.hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-[1rem] leading-[1.8] text-[#5f7280] sm:text-[1.08rem]">
            {t('galleryPage.hero.description')}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[0.9rem] font-medium leading-[1.7] text-[#78909e]">
            {t('galleryPage.hero.note')}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              className="rounded-full bg-[#13703e] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_28px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
              to="/donate"
            >
              {t('common.actions.donateNow')}
            </Link>
            <Link
              className="rounded-full border border-[#c8dcea] bg-white/80 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#abcbe0] hover:bg-[#edf7fc]"
              to="/programs"
            >
              {t('common.actions.viewPrograms')}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default GalleryHero
