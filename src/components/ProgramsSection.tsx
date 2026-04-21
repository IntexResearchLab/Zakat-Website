import Reveal from './Reveal'

const programCards = [
  {
    title: 'Education',
    subtitle: 'Scholarships and learning support.',
    image: '/assets/home/carousel-1.jpg',
  },
  {
    title: 'Medical',
    subtitle: 'Care for vulnerable communities.',
    image: '/assets/home/carousel-2.jpg',
  },
  {
    title: 'Widows',
    subtitle: 'Dignified support and livelihood help.',
    image: '/assets/home/carousel-3.jpg',
  },
  {
    title: 'Relief',
    subtitle: 'Emergency response with compassion.',
    image: '/assets/home/carousel-1.jpg',
  },
  {
    title: 'Slum School',
    subtitle: 'Learning access for underserved children.',
    image: '/assets/home/carousel-2.jpg',
  },
  {
    title: 'Livelihood',
    subtitle: 'Assets that help families rebuild.',
    image: '/assets/home/carousel-3.jpg',
  },
  {
    title: 'Elderly Care',
    subtitle: 'Regular support for older people.',
    image: '/assets/home/carousel-1.jpg',
  },
  {
    title: 'Women Support',
    subtitle: 'Practical assistance rooted in dignity.',
    image: '/assets/home/carousel-2.jpg',
  },
  {
    title: 'Community Aid',
    subtitle: 'Long-term care across local programs.',
    image: '/assets/home/carousel-3.jpg',
  },
]

function ProgramsSection() {
  const scrollingCards = [...programCards, ...programCards]

  return (
    <section className="bg-[#f9fdff] pt-14 pb-24 sm:pt-16 sm:pb-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-12 flex flex-col gap-6 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
              Our Focus Areas
            </p>
            <h2 className="max-w-xl font-serif text-[2.8rem] leading-[0.96] tracking-[-0.04em] text-[#14324d] sm:text-[3.5rem]">
              Programs Rooted in Dignity
            </h2>
          </div>

          <a
            className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#14324d] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
            href="#"
          >
            View All Programs
          </a>
        </Reveal>

        <Reveal className="overflow-hidden" delay={120}>
          <div className="programs-marquee-track flex w-max gap-6">
            {scrollingCards.map((card, index) => (
              <article
                className="group hover-lift-soft relative h-[18rem] w-[15rem] shrink-0 overflow-hidden rounded-[1.35rem] bg-[#173852] shadow-[0_12px_32px_rgba(15,23,42,0.08)] duration-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.14)]"
                key={`${card.title}-${index}`}
              >
                <img
                  alt={card.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  src={card.image}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,24,34,0.92),rgba(10,24,34,0.22),rgba(10,24,34,0.04))]" />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-serif text-[1.1rem] leading-none tracking-[-0.02em] text-white sm:text-[1.2rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[12rem] text-sm leading-[1.4] text-white/78">
                    {card.subtitle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsSection
