import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function OpinionsHero() {
  const { t } = useTranslation()

  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <Reveal className="max-w-4xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [{t('common.breadcrumb.home')} / <span className="text-[#c58b16]">{t('common.breadcrumb.opinions')}</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('opinions.hero.eyebrow')}
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#101d2b] sm:text-[4.2rem]">
            {t('opinions.hero.title')}
          </h1>
          <p className="mt-7 max-w-[40rem] text-[1.05rem] leading-[1.85] text-[#5d6d78] sm:text-[1.08rem]">
            {t('opinions.hero.description')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsHero
