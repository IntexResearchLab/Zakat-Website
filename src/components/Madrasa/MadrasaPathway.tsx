import Reveal from '../reusables/Reveal'
import { madrasaPathway } from './data'

function MadrasaPathway() {
  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            A Complete Educational Path
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3.1rem]">
            From memorization to mainstream continuation.
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-6 lg:grid-cols-3" delay={120}>
          {madrasaPathway.map((item, index) => (
            <div
              key={item.label}
              className="relative rounded-[1.35rem] border border-[#dde5de] bg-white p-6 shadow-[0_14px_30px_rgba(18,28,22,0.04)]"
            >
              {index < madrasaPathway.length - 1 ? (
                <span className="absolute right-[-1.25rem] top-1/2 hidden h-px w-5 bg-[#d4ddd5] lg:block" />
              ) : null}
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                {item.label}
              </p>
              <h3 className="mt-4 font-serif text-[1.6rem] leading-tight tracking-[-0.03em] text-[#1f382a]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.99rem] leading-[1.8] text-[#5f6d64]">
                {item.text}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-8 max-w-3xl text-[1rem] leading-[1.8] text-[#5f6d64]">
            Students graduate with both religious and academic foundations,
            allowing them to continue in mainstream education with confidence.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaPathway
