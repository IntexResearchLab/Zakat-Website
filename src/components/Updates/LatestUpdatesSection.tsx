import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useUpdates } from '../../lib/useUpdates'
import UpdateCard from './UpdateCard'

// The three newest posts. Renders nothing until there is at least one published post.
function LatestUpdatesSection() {
  const { t } = useTranslation()
  const { updates } = useUpdates()

  if (!updates?.length) {
    return null
  }

  return (
    <section aria-labelledby="latest-updates-title" className="border-t border-[#e3eef4] bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
              {t('updates.section.eyebrow')}
            </p>
            <h2
              className="mt-4 font-serif text-[2.3rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[2.8rem]"
              id="latest-updates-title"
            >
              {t('updates.section.title')}
            </h2>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#14324d] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
            to="/updates"
          >
            {t('updates.section.viewAll')}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {updates.slice(0, 3).map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestUpdatesSection
