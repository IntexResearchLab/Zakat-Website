import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getGalleryFilters, getGalleryItems } from './data'

function ProgramsGallery() {
  const { t } = useTranslation()
  const galleryFilters = getGalleryFilters(t)
  const galleryItems = getGalleryItems(t)
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredItems = (() => {
    if (activeFilter === 'all') {
      return galleryItems
    }

    return galleryItems.filter((item) => item.program === activeFilter)
  })()

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('programs.gallery.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('programs.gallery.title')}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {galleryFilters.map((filter) => (
              <button
                className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] transition ${
                  filter.id === activeFilter
                    ? 'border-[#115b82] bg-[#115b82] text-white'
                    : 'border-[#dce7ee] bg-white text-[#627581] hover:border-[#bdd6e4] hover:bg-[#f5fafe]'
                }`}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4" delay={120}>
          {filteredItems.map((item) => {
            const spanClass =
              item.span === 'large'
                ? 'xl:col-span-2 xl:row-span-2'
                : item.span === 'medium'
                  ? 'xl:col-span-2'
                  : ''

            const aspectClass =
              item.span === 'large'
                ? 'aspect-[5/5.2]'
                : item.span === 'medium'
                  ? 'aspect-[16/9]'
                  : 'aspect-[4/5]'

            return (
              <article
                className={`group relative overflow-hidden rounded-[1.3rem] border border-[#dbe7ee] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] ${spanClass}`}
                key={`${item.title}-${item.location}`}
              >
                <img
                  alt={item.title}
                  className={`${aspectClass} w-full object-cover transition duration-500 group-hover:scale-[1.04]`}
                  src={item.image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,24,34,0.88),rgba(12,24,34,0.18),rgba(12,24,34,0.02))] opacity-90 transition duration-300 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="translate-y-1 transition duration-300 group-hover:translate-y-0">
                    <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#d6efff]">
                      {item.program}
                    </p>
                    <h3 className="mt-2 max-w-[18rem] font-serif text-[1.2rem] leading-[1.08] tracking-[-0.03em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[0.9rem] leading-[1.5] text-white/78">
                      {item.location}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </Reveal>

        <Reveal
          className="mt-10 flex flex-col gap-4 border-t border-[#e4edf3] pt-8 sm:flex-row sm:items-center sm:justify-between"
          delay={180}
        >
          <p className="max-w-2xl text-[0.98rem] leading-[1.7] text-[#647783]">
            {t('programs.gallery.footer')}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#cfe0ea] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition hover:border-[#bdd6e4] hover:bg-[#f7fbfd]"
              href="#"
            >
              {t('common.actions.viewFullGallery')}
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#cfe0ea] bg-white px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition hover:border-[#bdd6e4] hover:bg-[#f7fbfd]"
              href="#"
            >
              {t('common.actions.readMagazine')}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsGallery
