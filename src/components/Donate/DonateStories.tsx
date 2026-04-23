import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateStories() {
  const { t } = useTranslation()
  const stories = t('donate.stories.items', {
    returnObjects: true,
  }) as Array<{ quote: string; name: string; role: string }>

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.stories.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.stories.title')}
          </h2>
          <p className="mt-6 max-w-2xl text-[1rem] leading-[1.8] text-[#60727d]">
            {t('donate.stories.description')}
          </p>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 lg:grid-cols-3" delay={110}>
          {stories.map((story) => (
            <article
              className="rounded-[1.3rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
              key={story.name}
            >
              <p className="font-serif text-[1.2rem] italic leading-[1.75] text-[#26455f]">
                “{story.quote}”
              </p>
              <div className="mt-6 border-t border-[#e4edf3] pt-5">
                <p className="text-[0.98rem] font-bold text-[#14324d]">{story.name}</p>
                <p className="mt-1 text-[0.9rem] leading-[1.65] text-[#647783]">{story.role}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonateStories
