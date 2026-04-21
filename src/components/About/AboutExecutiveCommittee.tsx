import { useEffect, useMemo, useState } from 'react'
import Reveal from '../reusables/Reveal'
import { committeeMembers } from './data'

function AboutExecutiveCommittee() {
  const [committeeSlide, setCommitteeSlide] = useState(0)
  const [committeeVisibleCount, setCommitteeVisibleCount] = useState(4)

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1280) {
        setCommitteeVisibleCount(4)
        return
      }
      if (window.innerWidth >= 768) {
        setCommitteeVisibleCount(2)
        return
      }
      setCommitteeVisibleCount(1)
    }

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  const committeeTotalSlides = Math.ceil(
    committeeMembers.length / committeeVisibleCount
  )
  const currentCommitteeSlide = Math.min(
    committeeSlide,
    Math.max(committeeTotalSlides - 1, 0)
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCommitteeSlide((current) => (current + 1) % committeeTotalSlides)
    }, 4000)
    return () => window.clearInterval(interval)
  }, [committeeTotalSlides])

  const committeeSlides = useMemo(
    () =>
      Array.from({ length: committeeTotalSlides }, (_, slideIndex) =>
        committeeMembers.slice(
          slideIndex * committeeVisibleCount,
          slideIndex * committeeVisibleCount + committeeVisibleCount
        )
      ),
    [committeeTotalSlides, committeeVisibleCount]
  )

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              Alokayon&apos;s Executive Committee
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              A trusted leadership team guiding Alokayon&apos;s service and
              direction.
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#5d6f7b] sm:text-[1.04rem]">
              Alokayon is supported by a 14-member executive committee that
              helps steer the organization with accountability, continuity, and
              care for the communities it serves.
            </p>
          </div>

          <div className="inline-flex items-center rounded-full border border-[#dce7ee] bg-[#f8fbfd] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            14-member committee
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={120}>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentCommitteeSlide * 100}%)` }}
            >
              {committeeSlides.map((slide, slideIndex) => (
                <div className="min-w-full" key={`committee-slide-${slideIndex + 1}`}>
                  <div
                    className={`grid gap-6 ${
                      committeeVisibleCount === 4
                        ? 'xl:grid-cols-4'
                        : committeeVisibleCount === 2
                          ? 'md:grid-cols-2'
                          : 'grid-cols-1'
                    }`}
                  >
                    {slide.map((member) => (
                      <article
                        className="group rounded-[1.25rem] border border-[#dbe7ee] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
                        key={member.name}
                      >
                        <div className="overflow-hidden rounded-[1rem] bg-[#f2f7fa]">
                          <img
                            alt={member.name}
                            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            src={member.image}
                          />
                        </div>
                        <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                          {member.name}
                        </h3>
                        <p className="mt-2 text-[0.92rem] font-medium leading-[1.6] text-[#6a7c87]">
                          {member.role}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[0.95rem] leading-[1.7] text-[#627581]">
              Browse through the committee members guiding Alokayon&apos;s
              direction and long-term service.
            </p>

            <div className="flex items-center gap-3">
              <button
                aria-label="Previous committee members"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                onClick={() =>
                  setCommitteeSlide((current) =>
                    current === 0 ? committeeTotalSlides - 1 : current - 1
                  )
                }
                type="button"
              >
                <span className="material-symbols-outlined text-[1.15rem]">west</span>
              </button>

              <div className="flex items-center gap-2">
                {committeeSlides.map((_, index) => (
                  <button
                    aria-label={`Show committee slide ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all ${
                      index === currentCommitteeSlide
                        ? 'w-8 bg-[#115b82]'
                        : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                    }`}
                    key={`committee-dot-${index + 1}`}
                    onClick={() => setCommitteeSlide(index)}
                    type="button"
                  />
                ))}
              </div>

              <button
                aria-label="Next committee members"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dce7ee] bg-white text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#f5fafe]"
                onClick={() =>
                  setCommitteeSlide((current) => (current + 1) % committeeTotalSlides)
                }
                type="button"
              >
                <span className="material-symbols-outlined text-[1.15rem]">east</span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutExecutiveCommittee
