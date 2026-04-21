import Reveal from '../reusables/Reveal'
import { studentSupportItems } from './data'

function SchoolWhatStudentsReceive() {
  return (
    <section className="bg-[#fbfdfe] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            What students receive
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3.1rem]">
            Practical support that keeps children learning.
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {studentSupportItems.map((item) => (
            <div
              key={item}
              className="rounded-[1.3rem] border border-[#dbe7ee] bg-white px-5 py-5 shadow-[0_14px_30px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 text-[1.15rem] text-[#2d8a57]">
                  task_alt
                </span>
                <p className="text-[1rem] leading-[1.75] text-[#516875]">{item}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolWhatStudentsReceive
