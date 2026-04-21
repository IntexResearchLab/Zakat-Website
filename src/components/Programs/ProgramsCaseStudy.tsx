import Reveal from '../reusables/Reveal'
import { caseStudy } from './data'

function ProgramsCaseStudy() {
  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-18">
        <Reveal>
          <div className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <img
              alt={caseStudy.title}
              className="aspect-[5/4] w-full object-cover"
              src={caseStudy.image}
            />
          </div>
        </Reveal>

        <Reveal className="max-w-2xl" delay={120}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {caseStudy.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {caseStudy.title}
          </h2>

          <div className="mt-7 space-y-5 text-[1rem] leading-[1.8] text-[#5d6f7b] sm:text-[1.04rem]">
            <p>
              <span className="font-semibold text-[#14324d]">Problem: </span>
              {caseStudy.problem}
            </p>
            <p>
              <span className="font-semibold text-[#14324d]">Reality: </span>
              {caseStudy.reality}
            </p>
            <p>
              <span className="font-semibold text-[#14324d]">Intervention: </span>
              {caseStudy.intervention}
            </p>
            <p>
              <span className="font-semibold text-[#14324d]">Impact: </span>
              {caseStudy.impact}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {caseStudy.timeline.map((step) => (
              <div
                className="rounded-[1rem] border border-[#dce7ee] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]"
                key={step.label}
              >
                <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {step.label}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.65] text-[#60727d]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsCaseStudy
