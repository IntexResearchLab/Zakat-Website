import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { getGalleryCategoryLabel } from '../components/Gallery/data'
import Breadcrumb from '../components/reusables/Breadcrumb'
import {
  getYouTubeEmbedUrl,
  getYouTubeId,
  localizedUpdateText,
  splitParagraphs,
  updateDate,
} from '../lib/updates'
import { useDateFormatter } from '../lib/useTakaFormatter'
import { useUpdates } from '../lib/useUpdates'
import NotFound from './NotFound'

function UpdateDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const formatDate = useDateFormatter()
  const { updates, isLoading, hasError } = useUpdates()
  // useUpdates only returns published posts, so hidden ones show the "not found" page.
  const update = updates?.find((item) => item.slug === slug)

  if (isLoading) {
    return (
      <p className="px-6 py-24 text-center text-[#5d6d78]" role="status">
        {t('updates.page.loading')}
      </p>
    )
  }

  if (hasError) {
    return (
      <p className="px-6 py-24 text-center text-[#5d6d78]" role="alert">
        {t('updates.page.error')}
      </p>
    )
  }

  if (!update) {
    return <NotFound />
  }

  const title = localizedUpdateText(update, 'title', i18n.language)
  const paragraphs = splitParagraphs(localizedUpdateText(update, 'body', i18n.language))
  const videoId = update.youtube_url ? getYouTubeId(update.youtube_url) : null
  const photoCount = update.photos.length

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[#f7fbfd]">
        <div className="mx-auto max-w-4xl px-6 pb-10 pt-12">
          <Breadcrumb
            items={[{ label: t('common.breadcrumb.updates'), to: '/updates' }, { label: title }]}
          />
          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#5d6d78]">
            <time dateTime={update.published_on}>{formatDate(updateDate(update))}</time>
            {update.program ? (
              <span className="text-[#115b82]">{getGalleryCategoryLabel(t, update.program)}</span>
            ) : null}
          </p>
          <h1 className="mt-4 break-words font-serif text-[2.3rem] font-semibold leading-[1.05] tracking-[-0.04em] text-[#101d2b] sm:text-[3rem]">
            {title}
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-12">
        <div className="max-w-3xl space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              className="whitespace-pre-line break-words text-[1.04rem] leading-[1.85] text-[#4f6170]"
              key={index}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {videoId ? (
          <section aria-label={t('updates.detail.videoTitle', { title })} className="mt-10">
            <div className="aspect-video w-full overflow-hidden rounded-[1.2rem] bg-[#0f2740] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <iframe
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={getYouTubeEmbedUrl(videoId)}
                title={t('updates.detail.videoTitle', { title })}
              />
            </div>
          </section>
        ) : null}

        {photoCount ? (
          <section aria-label={t('updates.detail.photosLabel')} className="mt-10">
            <ul
              className={`grid gap-3 sm:gap-4 ${photoCount === 1 ? '' : 'grid-cols-2 lg:grid-cols-3'}`}
            >
              {update.photos.map((photo, index) => (
                <li
                  className={
                    // A single photo, or the first of an odd-length set on phones, gets the full width.
                    photoCount > 1 && index === 0 && photoCount % 2 === 1
                      ? 'col-span-2 lg:col-span-1'
                      : ''
                  }
                  key={photo}
                >
                  <a
                    className="block overflow-hidden rounded-[1rem] border border-[#dbe7ee] bg-[#eef6fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#115b82] focus-visible:ring-offset-2"
                    href={photo}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      alt={t('updates.detail.photoAlt', {
                        title,
                        number: index + 1,
                        total: photoCount,
                      })}
                      className={`w-full object-cover transition duration-300 hover:scale-[1.02] ${
                        photoCount === 1 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                      }`}
                      decoding="async"
                      fetchPriority={index === 0 && !videoId ? 'high' : undefined}
                      loading={index === 0 ? undefined : 'lazy'}
                      src={photo}
                    />
                    <span className="sr-only">{t('updates.detail.openPhoto')}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 flex flex-col gap-4 border-t border-[#edf3f7] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:text-[#0d4766]"
            to="/updates"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
              west
            </span>
            {t('updates.detail.backToAll')}
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#13703e] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
            to="/donate"
          >
            {t('updates.detail.donate')}
          </Link>
        </div>
      </article>
    </div>
  )
}

export default UpdateDetail
