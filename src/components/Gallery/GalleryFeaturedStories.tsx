import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'
import { getFeaturedStories } from './data'

function GalleryFeaturedStories() {
  const { t } = useTranslation()
  const stories = getFeaturedStories(t)

  return (
    <section className="bg-[#fcfbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('galleryPage.featured.eyebrow')}
          </p>
          <h2 className="mt-4 font-serif text-[2.3rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[2.95rem]">
            {t('galleryPage.featured.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 lg:grid-cols-3" delay={120}>
          {stories.map((story) => (
            <article
              className="overflow-hidden rounded-[1.2rem] border border-[#dbe7ee] bg-white shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              key={story.title}
            >
              <img
                alt={story.title}
                className="aspect-[4/3] w-full object-cover"
                src={story.image}
              />
              <div className="p-6">
                <h3 className="font-serif text-[1.45rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                  {story.title}
                </h3>
                <p className="mt-4 text-[0.98rem] leading-[1.72] text-[#5f7280]">
                  {story.description}
                </p>
                <Link
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:gap-3"
                  to={story.href}
                >
                  {story.linkLabel}
                  <span aria-hidden="true" className="text-base leading-none">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default GalleryFeaturedStories
