import Reveal from '../reusables/Reveal'

function SchoolWhyMatters() {
  return (
    <section className="bg-white py-18 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            Why this school matters
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.03] tracking-[-0.04em] text-[#14324d] sm:text-[3.3rem]">
            Education as an interruption to neglect.
          </h2>
          <p className="mx-auto mt-7 max-w-[46rem] text-[1.02rem] leading-[1.9] text-[#5f7280]">
            Children carry the potential of tomorrow’s poets, artists,
            scientists, teachers, and leaders. Yet many underprivileged
            children grow up without access to food, shelter, healthcare, or
            education.
          </p>
          <p className="mx-auto mt-5 max-w-[46rem] text-[1.02rem] leading-[1.9] text-[#5f7280]">
            Alokayon School exists to interrupt that cycle early so children are
            not pushed toward neglect, illiteracy, or harmful environments, but
            instead grow with dignity, discipline, and possibility.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolWhyMatters
