import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getFeaturedStory } from './data'
import { useStories } from '../../lib/stories'
import { builtInFeaturedImage } from '../../lib/storyImport'

function OpinionsFeaturedStory() {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const builtIn = getFeaturedStory(t)
  // The first visible beneficiary story from the admin, or the built-in story until there is one.
  const featuredStory = useStories('beneficiary', [
    {
      id: 'built-in',
      title: builtIn.title,
      summary: [builtIn.summary, builtIn.summaryTwo].filter(Boolean),
      body: builtIn.fullStory ?? [],
      name: '',
      role: '',
      badges: builtIn.badges ?? [],
      image: builtInFeaturedImage,
    },
  ])[0]

  if (!featuredStory) {
    return null
  }

  return (
    <section className="bg-[#fbfdfe] py-18 sm:py-22">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:gap-18">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.8rem] border border-[#dbe7ee] bg-[radial-gradient(circle_at_top,#fafdff_0%,#eff6fb_52%,#e8f0f5_100%)] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <img
              alt={t('common.aria.featuredStoryImage')}
              className="aspect-[4/5] w-full rounded-[1.3rem] object-cover"
              decoding="async"
              loading="lazy"
              src={featuredStory.image ?? builtInFeaturedImage}
            />
            <div className="mt-6 rounded-[1.2rem] border border-white/80 bg-white/82 p-5 backdrop-blur-sm">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
                {t('opinions.featuredStory.cardEyebrow')}
              </p>
              {/* The built-in caption describes the original story; admin stories show their own person. */}
              {featuredStory.name ? (
                <p className="mt-3 text-[1rem] leading-[1.75] text-[#586b78]">
                  <span className="font-semibold text-[#14324d]">{featuredStory.name}</span>
                  {featuredStory.role ? ` · ${featuredStory.role}` : ''}
                </p>
              ) : (
                <p className="mt-3 text-[1rem] leading-[1.75] text-[#586b78]">
                  {t('opinions.featuredStory.cardDescription')}
                </p>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal className="max-w-3xl" delay={120}>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {builtIn.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            {featuredStory.title}
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {featuredStory.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#d6e3ec] bg-white px-4 py-2 text-sm font-semibold text-[#4e6778]"
              >
                {badge}
              </span>
            ))}
          </div>

          {featuredStory.summary.map((paragraph, index) => (
            <p
              className={`${index === 0 ? 'mt-7' : 'mt-5'} text-[1.02rem] leading-[1.9] text-[#5f7280]`}
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}

          {isExpanded ? (
            <div className="mt-6 space-y-4 rounded-[1.4rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
              {featuredStory.body.map((paragraph) => (
                <p key={paragraph} className="text-[1rem] leading-[1.85] text-[#5c6f7b]">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {featuredStory.body.length ? (
            <button
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:text-[#0d4f72]"
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
            >
              {isExpanded
                ? t('opinions.featuredStory.hideFullStory')
                : t('opinions.featuredStory.readFullStory')}
              <span aria-hidden="true" className="material-symbols-outlined text-[1.15rem]">
                {isExpanded ? 'expand_less' : 'arrow_forward'}
              </span>
            </button>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsFeaturedStory
