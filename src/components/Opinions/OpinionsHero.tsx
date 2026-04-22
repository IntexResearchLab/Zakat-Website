import Reveal from '../reusables/Reveal'

function OpinionsHero() {
  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <Reveal className="max-w-4xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [Home / <span className="text-[#c58b16]">Opinions of Beneficiaries</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            Voices of Impact
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.96] tracking-[-0.05em] text-[#101d2b] sm:text-[4.2rem]">
            Real stories from the lives transformed through Alokayon.
          </h1>
          <p className="mt-7 max-w-[40rem] text-[1.05rem] leading-[1.85] text-[#5d6d78] sm:text-[1.08rem]">
            From education to survival, these are not just testimonials. They
            are journeys shaped by hardship, support, dignity, and human care.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

export default OpinionsHero
