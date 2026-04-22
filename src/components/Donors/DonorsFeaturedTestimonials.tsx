import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getDonorCards, getFeaturedDonor } from './data'

function DonorsFeaturedTestimonials() {
  const { t } = useTranslation()
  const featuredDonor = getFeaturedDonor(t)
  const donorCards = getDonorCards(t)

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-10 lg:grid-cols-[1.03fr_0.97fr] lg:items-stretch lg:gap-14">
          <article className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
              <div className="relative overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_top,rgba(245,250,254,1),rgba(231,241,248,1))] p-4">
                <img
                  alt={featuredDonor.name}
                  className="aspect-[4/5] w-full rounded-[1.15rem] object-cover"
                  src={featuredDonor.image}
                />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                  {featuredDonor.eyebrow}
                </p>
                <h2 className="mt-4 font-serif text-[2.2rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[2.6rem]">
                  {featuredDonor.title}
                </h2>
                <p className="mt-6 font-serif text-[1.28rem] italic leading-[1.72] text-[#26455f] sm:text-[1.42rem]">
                  “{featuredDonor.quote}”
                </p>
                <div className="mt-6 border-t border-[#e4edf3] pt-5">
                  <p className="text-[1rem] font-bold text-[#14324d]">{featuredDonor.name}</p>
                  <p className="mt-1 text-[0.96rem] leading-[1.7] text-[#61727d]">
                    {featuredDonor.role}
                  </p>
                  <p className="mt-1 text-[0.86rem] font-semibold uppercase tracking-[0.12em] text-[#115b82]">
                    {featuredDonor.location}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-5 sm:grid-cols-2">
            {donorCards.map((card) => (
              <Reveal
                className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                key={card.name}
                delay={90}
              >
                <div className="flex items-start gap-4">
                  <img
                    alt={card.name}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                    src={card.image}
                  />
                  <div>
                    <p className="font-serif text-[1.12rem] italic leading-[1.7] text-[#27465f]">
                      “{card.quote}”
                    </p>
                    <div className="mt-5">
                      <p className="text-[0.98rem] font-bold text-[#14324d]">{card.name}</p>
                      <p className="mt-1 text-[0.9rem] leading-[1.6] text-[#627581]">
                        {card.role}
                      </p>
                      <p className="mt-1 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                        {card.location}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsFeaturedTestimonials
