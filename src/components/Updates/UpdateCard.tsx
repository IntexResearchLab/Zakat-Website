import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getGalleryCategoryLabel } from '../Gallery/data'
import { localizedUpdateText, updateDate, type UpdateRecord } from '../../lib/updates'
import { useDateFormatter } from '../../lib/useTakaFormatter'

type UpdateCardProps = {
  update: UpdateRecord
  headingLevel?: 'h2' | 'h3'
}

function UpdateCard({ update, headingLevel = 'h3' }: UpdateCardProps) {
  const { t, i18n } = useTranslation()
  const formatDate = useDateFormatter()
  const title = localizedUpdateText(update, 'title', i18n.language)
  const coverPhoto = update.photos[0]
  const Heading = headingLevel

  return (
    <article className="relative flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:shadow-[0_22px_48px_rgba(15,23,42,0.1)]">
      {coverPhoto ? (
        <img
          alt=""
          className="aspect-[16/10] w-full object-cover"
          decoding="async"
          loading="lazy"
          src={coverPhoto}
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex aspect-[16/10] w-full items-center justify-center bg-[linear-gradient(135deg,#115b82,#13703e)]"
        >
          <span className="material-symbols-outlined text-[3rem] text-white/70">
            {update.youtube_url ? 'play_arrow' : 'article'}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[#5d6d78]">
          <time dateTime={update.published_on}>{formatDate(updateDate(update))}</time>
          {update.program ? (
            <span className="text-[#115b82]">{getGalleryCategoryLabel(t, update.program)}</span>
          ) : null}
          {update.youtube_url ? (
            <span className="inline-flex items-center gap-1 text-[#9e3342]">
              <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                play_arrow
              </span>
              {t('updates.card.video')}
            </span>
          ) : null}
        </p>
        <Heading className="break-words font-serif text-[1.4rem] leading-tight tracking-[-0.02em] text-[#14324d]">
          {/* The whole card is clickable through this link's stretched hit area. */}
          <Link
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[1.35rem] focus-visible:after:ring-2 focus-visible:after:ring-[#115b82]"
            to={`/updates/${update.slug}`}
          >
            {title}
          </Link>
        </Heading>
        <p className="line-clamp-3 break-words text-[0.95rem] leading-[1.7] text-[#4f6170]">
          {localizedUpdateText(update, 'body', i18n.language)}
        </p>
        <span
          aria-hidden="true"
          className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#13703e]"
        >
          {t('updates.card.readMore')}
          <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
        </span>
      </div>
    </article>
  )
}

export default UpdateCard
