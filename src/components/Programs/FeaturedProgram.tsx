import Reveal from '../reusables/Reveal'
import { featuredProgram } from './data'

function FeaturedProgram() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-18">
        <Reveal>
          <div className="overflow-hidden rounded-[1.6rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <img
              alt={featuredProgram.title}
              className="aspect-[5/4] w-full object-cover"
              src={featuredProgram.image}
            />
          </div>
        </Reveal>

        <Reveal className="max-w-2xl" delay={120}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {featuredProgram.eyebrow}
          </p>
          <h2 className="mt-5 font-serif text-[2.6rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            {featuredProgram.title}
          </h2>
          <p className="mt-6 text-[1rem] leading-[1.85] text-[#5d6f7b] sm:text-[1.04rem]">
            {featuredProgram.description}
          </p>

          <div className="mt-7 space-y-4 border-t border-[#dce7ee] pt-6">
            {featuredProgram.points.map((item) => (
              <div className="flex items-start gap-3" key={item}>
                <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                  task_alt
                </span>
                <p className="text-[0.98rem] leading-[1.7] text-[#4f6472]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {featuredProgram.stats.map((stat) => (
              <div
                className="rounded-[1rem] border border-[#dbe7ee] bg-[#fbfdfe] px-5 py-5"
                key={stat.label}
              >
                <p className="font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.86rem] font-semibold text-[#697b86]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default FeaturedProgram
