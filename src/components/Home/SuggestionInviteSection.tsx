import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

// A short invitation to the suggestion box, which lives at the bottom of the Contact page.
function SuggestionInviteSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-6 rounded-[1.35rem] border border-[#d8e5ec] bg-[#f7fbfd] p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
              {t('home.suggestionInvite.eyebrow')}
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-[1.05] tracking-[-0.03em] text-[#14324d] sm:text-[2.4rem]">
              {t('home.suggestionInvite.title')}
            </h2>
            <p className="mt-4 text-[1rem] leading-[1.7] text-[#5b6d7a]">
              {t('home.suggestionInvite.text')}
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#115b82] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72] lg:self-center"
            to="/contact#suggestion-box"
          >
            {t('home.suggestionInvite.button')}
            <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
              arrow_forward
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

export default SuggestionInviteSection
