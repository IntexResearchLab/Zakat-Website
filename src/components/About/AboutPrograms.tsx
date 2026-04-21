import Reveal from '../reusables/Reveal'
import { programs } from './data'

function AboutPrograms() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              What We Do
            </p>
            <h2 className="mt-5 font-serif text-[2.65rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.2rem]">
              Practical programs shaped around education, care, and relief.
            </h2>
          </div>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {programs.map((program) => (
            <article
              className="rounded-[1.2rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={program.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82]">
                <span className="material-symbols-outlined text-[1.55rem]">
                  {program.icon}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-[1.5rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                {program.title}
              </h3>
              <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#5d6f7b]">
                {program.description}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default AboutPrograms
