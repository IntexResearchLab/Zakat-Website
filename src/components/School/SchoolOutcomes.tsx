import Reveal from '../reusables/Reveal'
import { schoolOutcomes } from './data'

function SchoolOutcomes() {
  return (
    <section className="bg-[#fbfdfe] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            From classroom support to school admission
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            Outcomes that show the classroom is opening real doors.
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-3" delay={120}>
          {schoolOutcomes.map((item) => (
            <div
              key={item.year}
              className="rounded-[1.4rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
                {item.year}
              </p>
              <p className="mt-5 font-serif text-[3rem] leading-none tracking-[-0.05em] text-[#14324d]">
                {item.value}
              </p>
              <p className="mt-3 text-[1rem] leading-[1.7] text-[#5f7280]">{item.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-8 text-center text-[1rem] font-medium leading-[1.8] text-[#516875]">
            45 underprivileged children moved into formal primary education in
            three years.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolOutcomes
