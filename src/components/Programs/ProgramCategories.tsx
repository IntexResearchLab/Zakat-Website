import { useMemo, useState } from 'react'
import Reveal from '../reusables/Reveal'
import { filterTabs, programCategories } from './data'

function ProgramCategories() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredPrograms = useMemo(() => {
    if (activeFilter === 'All') {
      return programCategories
    }

    if (activeFilter === 'Education') {
      return programCategories.filter((item) => item.title === 'Education')
    }

    if (activeFilter === 'Healthcare') {
      return programCategories.filter((item) => item.title === 'Healthcare')
    }

    if (activeFilter === 'Relief') {
      return programCategories.filter(
        (item) =>
          item.title === 'Relief & Food Aid' || item.title === 'Community Support'
      )
    }

    return programCategories.filter((item) => item.title === 'Livelihood Support')
  }, [activeFilter])

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              Program Categories
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              Modern support programs shaped around real need.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {filterTabs.map((tab) => (
              <button
                className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.16em] transition ${
                  tab === activeFilter
                    ? 'border-[#115b82] bg-[#115b82] text-white'
                    : 'border-[#dce7ee] bg-white text-[#627581] hover:border-[#bdd6e4] hover:bg-[#f5fafe]'
                }`}
                key={tab}
                onClick={() => setActiveFilter(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {filteredPrograms.map((program) => (
            <article
              className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
              key={program.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82]">
                <span className="material-symbols-outlined text-[1.55rem]">
                  {program.icon}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-[1.55rem] leading-[1.04] tracking-[-0.03em] text-[#14324d]">
                {program.title}
              </h3>
              <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#5d6f7b]">
                {program.description}
              </p>

              <div className="mt-6 space-y-3 border-t border-[#e6eef3] pt-5">
                {program.highlights.map((item) => (
                  <div className="flex items-start gap-3" key={item}>
                    <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                      task_alt
                    </span>
                    <p className="text-[0.92rem] leading-[1.65] text-[#60727d]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <a
                className="mt-6 inline-flex items-center gap-3 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:gap-4"
                href="#"
              >
                Learn More
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </a>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramCategories
