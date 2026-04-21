import Reveal from '../reusables/Reveal'
import { programStories } from './data'

function ProgramsStories() {
  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            Real Stories
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            Human outcomes behind every program.
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 lg:grid-cols-3" delay={120}>
          {programStories.map((story) => (
            <article
              className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={story.person + story.context}
            >
              <p className="font-serif text-[1.25rem] italic leading-[1.7] text-[#26455f]">
                “{story.quote}”
              </p>
              <div className="mt-6 border-t border-[#e7eef3] pt-5">
                <p className="text-[1rem] font-bold text-[#14324d]">{story.person}</p>
                <p className="mt-1 text-[0.9rem] text-[#6b7a86]">{story.context}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsStories
