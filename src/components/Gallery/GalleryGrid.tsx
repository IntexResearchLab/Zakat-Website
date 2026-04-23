import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getGalleryFilters, getGalleryItems, type GalleryItem } from './data'

function getSpanClass(span: GalleryItem['span']) {
  if (span === 'large') {
    return 'md:col-span-2 md:row-span-2'
  }
  if (span === 'medium') {
    return 'md:col-span-2'
  }
  return ''
}

function GalleryGrid() {
  const { t } = useTranslation()
  const filters = getGalleryFilters(t)
  const items = getGalleryItems(t)
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    if (!selectedItem) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedItem])

  const visibleItems = useMemo(() => {
    if (activeFilter === 'all') {
      return items
    }

    return items.filter((item) => item.filterId === activeFilter)
  }, [activeFilter, items])

  return (
    <>
      <section className="bg-white py-18 sm:py-22">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('galleryPage.grid.eyebrow')}
            </p>
            <h2 className="mt-4 font-serif text-[2.35rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('galleryPage.grid.title')}
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#5f7280]">
              {t('galleryPage.grid.description')}
            </p>
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3" delay={90}>
            {filters.map((filter) => (
              <button
                className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                  activeFilter === filter.id
                    ? 'bg-[#14324d] text-white'
                    : 'border border-[#d8e5ec] bg-[#f8fbfd] text-[#587189] hover:border-[#bdd6e4] hover:text-[#115b82]'
                }`}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </Reveal>

          <Reveal className="mt-10" delay={120}>
            <div className="grid auto-rows-[14rem] gap-5 md:grid-cols-4">
              {visibleItems.map((item) => (
                <button
                  className={`group relative overflow-hidden rounded-[1.15rem] bg-[#14324d] text-left shadow-[0_18px_42px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(15,23,42,0.12)] ${getSpanClass(
                    item.span,
                  )}`}
                  key={`${item.title}-${item.location}`}
                  onClick={() => setSelectedItem(item)}
                  type="button"
                >
                  <img
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    src={item.image}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,24,34,0.92),rgba(10,24,34,0.32),rgba(10,24,34,0.08))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[#f1c75b]">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-serif text-[1.45rem] leading-[1.02] tracking-[-0.03em] text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[22rem] text-[0.95rem] leading-[1.55] text-white/82">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {selectedItem ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#09131ccc]/82 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
          role="dialog"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label={t('galleryPage.grid.closeImage')}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#14324d] shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition hover:bg-white"
              onClick={() => setSelectedItem(null)}
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">close</span>
            </button>

            <div className="max-h-[86vh] overflow-y-auto rounded-[1.45rem] border border-[#dce7ee] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
                <div className="overflow-hidden rounded-[1.1rem] bg-[#f3f8fb]">
                  <img
                    alt={selectedItem.title}
                    className="w-full object-cover"
                    src={selectedItem.image}
                  />
                </div>

                <div>
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.18em] text-[#115b82]">
                    {selectedItem.category}
                  </p>
                  <h3 className="mt-4 font-serif text-[2rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[2.5rem]">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-5 text-[1rem] leading-[1.82] text-[#5f7280]">
                    {selectedItem.story}
                  </p>

                  <div className="mt-6 grid gap-4 border-t border-[#d8e5ec] pt-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                        {t('galleryPage.grid.locationLabel')}
                      </p>
                      <p className="mt-2 text-[0.96rem] text-[#5f7280]">{selectedItem.location}</p>
                    </div>
                    <div>
                      <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                        {t('galleryPage.grid.yearLabel')}
                      </p>
                      <p className="mt-2 text-[0.96rem] text-[#5f7280]">{selectedItem.year}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default GalleryGrid
