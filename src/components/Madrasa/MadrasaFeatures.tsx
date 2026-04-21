import Reveal from '../reusables/Reveal'
import { madrasaFeatures } from './data'

function MadrasaFeatures() {
  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            What makes this madrasa different
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3.1rem]">
            Structured learning with spiritual and academic balance.
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {madrasaFeatures.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.35rem] border border-[#dde5de] bg-[#fcfdfb] p-6 shadow-[0_14px_30px_rgba(18,28,22,0.04)]"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6f0] text-[#2f6a52]">
                <span className="material-symbols-outlined text-[1.4rem]">
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-[1.65rem] leading-tight tracking-[-0.03em] text-[#1f382a]">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.99rem] leading-[1.8] text-[#5f6d64]">
                {item.text}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaFeatures
