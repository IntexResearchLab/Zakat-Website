import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getDonorStories } from './data'

function DonorsStories() {
  const { t } = useTranslation()
  const donorStories = getDonorStories(t)
  const [openStory, setOpenStory] = useState<number | null>(0)

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donors.stories.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donors.stories.title')}
          </h2>
        </Reveal>

        <div className="mt-10 space-y-4">
          {donorStories.map((story, index) => {
            const isOpen = openStory === index

            return (
              <Reveal key={story.name} delay={80}>
                <article className="rounded-[1.3rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:p-7">
                  <button
                    className="flex w-full items-start justify-between gap-4 text-left"
                    type="button"
                    onClick={() => setOpenStory((current) => (current === index ? null : index))}
                  >
                    <div>
                      <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                        {story.title}
                      </p>
                      <p className="mt-3 text-[1rem] leading-[1.75] text-[#5f7280]">
                        {story.summary}
                      </p>
                      <div className="mt-4">
                        <p className="text-[0.96rem] font-bold text-[#14324d]">{story.name}</p>
                        <p className="mt-1 text-[0.88rem] text-[#677986]">{story.role}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined mt-1 text-[#115b82]">
                      {isOpen ? 'remove' : 'add'}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="mt-6 space-y-4 border-t border-[#e4edf3] pt-5">
                      {story.paragraphs.map((paragraph) => (
                        <p
                          className="text-[0.98rem] leading-[1.82] text-[#5f7280]"
                          key={paragraph}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default DonorsStories
