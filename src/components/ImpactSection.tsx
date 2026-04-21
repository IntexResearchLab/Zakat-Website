import Reveal from './Reveal'

const primaryImpactStats = [
  { value: '200+', label: 'Students Supported' },
  { value: '50+', label: 'Children in Slum School' },
  { value: '1.3M+ BDT', label: 'Distributed Annually' },
  { value: '60', label: 'Elderly Supported' },
  { value: 'Since 2011', label: 'Serving Communities' },
  { value: '70+', label: 'Widows Supported' },
  { value: '500+', label: 'Livelihood Assets Distributed' },
]

function ImpactSection() {
  return (
    <section className="bg-[#f4f7f2] py-12 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:flex-row lg:items-start lg:justify-between lg:gap-24">
        <Reveal className="max-w-md">
          <h2 className="text-[2.15rem] font-black leading-[1.05] tracking-[-0.04em] text-[#14324d] sm:text-[2.65rem]">
            A trusted record of impact.
          </h2>
          <p className="mt-5 max-w-[26rem] text-[0.98rem] leading-[1.65] text-[#6a786e]">
            Verified figures from Alokayon’s magazine, showing a clear snapshot
            of support across education, care, and long-term service.
          </p>
          <a
            className="mt-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4"
            href="#"
          >
            Read Our Magazine
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </a>
        </Reveal>

        <Reveal
          className="grid flex-1 grid-cols-2 gap-x-10 gap-y-8 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-10"
          delay={120}
        >
          {primaryImpactStats.map((stat) => (
            <div className="hover-lift-soft" key={stat.label}>
              <p className="font-serif text-[2.05rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[2.8rem]">
                {stat.value}
              </p>
              <p className="mt-3 max-w-[10rem] text-[0.82rem] leading-[1.4] text-[#6a786e]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ImpactSection
