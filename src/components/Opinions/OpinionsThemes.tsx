import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import {
  getEducationStories,
  getFamilySupportStories,
  getReliefStories,
} from './data'

function StoryList({
  title,
  intro,
  items,
}: {
  title: string
  intro: string
  items: { quote: string; name: string; role: string }[]
}) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">{title}</p>
      <p className="mt-4 max-w-2xl text-[1rem] leading-[1.8] text-[#5f7280]">{intro}</p>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div
            key={`${item.name}-${item.role}`}
            className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
          >
            <p className="text-[1rem] leading-[1.75] text-[#516875]">“{item.quote}”</p>
            <div className="mt-4 border-t border-[#e5edf3] pt-3">
              <p className="text-[0.98rem] font-semibold text-[#14324d]">{item.name}</p>
              <p className="mt-1 text-[0.92rem] text-[#71828d]">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OpinionsThemes() {
  const { t } = useTranslation()
  const educationStories = getEducationStories(t)
  const familySupportStories = getFamilySupportStories(t)
  const reliefStories = getReliefStories(t)

  return (
    <section className="bg-[#fbfdfe] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-12 lg:grid-cols-2">
          <StoryList
            title={t('opinions.themes.education.title')}
            intro={t('opinions.themes.education.intro')}
            items={educationStories}
          />

          <StoryList
            title={t('opinions.themes.family.title')}
            intro={t('opinions.themes.family.intro')}
            items={familySupportStories}
          />
        </Reveal>

        <Reveal
          className="mt-12 overflow-hidden rounded-[1.8rem] border border-[#dbe7ee] bg-[#12344a] text-white shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          delay={140}
        >
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffd266]">
                {t('opinions.themes.relief.title')}
              </p>
              <h3 className="mt-5 font-serif text-[2.2rem] leading-[1.02] tracking-[-0.04em] text-white sm:text-[2.8rem]">
                {t('opinions.themes.relief.heading')}
              </h3>
              <p className="mt-6 max-w-2xl text-[1rem] leading-[1.85] text-white/82">
                {t('opinions.themes.relief.description')}
              </p>
              <div className="mt-6 rounded-[1.25rem] border border-white/14 bg-white/8 p-5 backdrop-blur-sm">
                <p className="text-[1rem] leading-[1.8] text-white/90">
                  “{reliefStories[0].quote}”
                </p>
                <div className="mt-4 border-t border-white/12 pt-3">
                  <p className="text-[0.98rem] font-semibold text-white">{reliefStories[0].name}</p>
                  <p className="mt-1 text-[0.92rem] text-white/70">{reliefStories[0].role}</p>
                </div>
              </div>
            </div>

            <div className="min-h-[20rem]">
              <img
                alt={t('opinions.themes.relief.imageAlt')}
                className="h-full w-full object-cover"
                src={reliefStories[0].image}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsThemes
