import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getTestimonialCards } from './data'

function OpinionsTestimonialGrid() {
  const { t } = useTranslation()
  const testimonialCards = getTestimonialCards(t)

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('opinions.grid.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('opinions.grid.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {testimonialCards.map((card) => (
            <article
              key={card.name}
              className="rounded-[1.4rem] border border-[#dbe7ee] bg-[#fbfdff] p-6 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
            >
              <p className="font-serif text-[1.7rem] leading-tight tracking-[-0.03em] text-[#14324d]">
                {card.title}
              </p>
              <p className="mt-4 text-[1rem] leading-[1.8] text-[#5f7280]">
                “{card.quote}”
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#eef7fb] px-3 py-1.5 text-[0.8rem] font-semibold text-[#115b82]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 border-t border-[#e3edf3] pt-4">
                <p className="text-[1rem] font-semibold text-[#14324d]">{card.name}</p>
                <p className="mt-1 text-[0.95rem] text-[#6b7b87]">
                  {card.role}
                  {card.location ? `, ${card.location}` : ''}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsTestimonialGrid
