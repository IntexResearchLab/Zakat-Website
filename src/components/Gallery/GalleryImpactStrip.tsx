import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function GalleryImpactStrip() {
  const { t } = useTranslation()
  const stats = t('galleryPage.impact.stats', {
    returnObjects: true,
  }) as Array<{ value: string; label: string }>

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('galleryPage.impact.eyebrow')}
          </p>
          <h2 className="mt-4 font-serif text-[2.3rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[2.95rem]">
            {t('galleryPage.impact.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-8 border-t border-[#d9e6ee] pt-8" delay={110}>
          <div className="grid gap-y-8 text-left md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-[2.7rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3.2rem]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.9rem] font-semibold tracking-[0.02em] text-[#697b86]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default GalleryImpactStrip
