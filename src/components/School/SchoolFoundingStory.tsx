import Reveal from '../reusables/Reveal'
import { schoolTimeline } from './data'

function SchoolFoundingStory() {
  return (
    <section className="bg-[#fbfdfe] py-18 sm:py-22">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-18">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            How Alokayon School began
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            From a veranda lesson to a formal learning space.
          </h2>
          <p className="mt-7 text-[1.02rem] leading-[1.9] text-[#5f7280]">
            For a long time, Alokayon wanted to create educational opportunities
            for underprivileged children but lacked the facilities and resources
            to begin. That changed when Jesmin Akter, who had been teaching slum
            children on the veranda of her house, came into contact with the
            organization.
          </p>
          <p className="mt-5 text-[1.02rem] leading-[1.9] text-[#5f7280]">
            Alokayon responded by renting a small tin-shed room, arranging
            seating, and providing books, notebooks, and pens. The school was
            then formally inaugurated as Alokayon Pathshala on 13 February 2023.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[1.6rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="space-y-7">
              {schoolTimeline.map((item, index) => (
                <div className="relative pl-10" key={item.label}>
                  {index < schoolTimeline.length - 1 ? (
                    <span className="absolute left-[0.65rem] top-7 h-[calc(100%+1.1rem)] w-px bg-[#d7e4ec]" />
                  ) : null}
                  <span className="absolute left-0 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#bcd7e6] bg-[#edf7fc]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#115b82]" />
                  </span>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
                    {item.label}
                  </p>
                  <p className="mt-2 font-serif text-[1.45rem] leading-[1.25] tracking-[-0.03em] text-[#14324d]">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolFoundingStory
