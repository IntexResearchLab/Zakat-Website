import Reveal from '../reusables/Reveal'

function AboutHero() {
  return (
    <section className="border-b border-[#d8e5ec] bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#5f7280]">
            [Home / <span className="text-[#c58b16]">About Us</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            About Alokayon
          </p>
          <h1 className="mt-5 max-w-[11ch] text-[3rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#101d2b] sm:text-[4.35rem]">
            Serving people with care, trust, and dignity.
          </h1>
          <p className="mt-8 max-w-[30rem] text-[1.03rem] leading-[1.9] text-[#5d6d78] sm:text-[1.06rem]">
            Alokayon is a non-profit, non-political charity in Bangladesh
            working to support underprivileged communities through education,
            healthcare, and compassionate relief.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(17,91,130,0.18)] transition hover:bg-[#0d4f72]"
              href="#"
            >
              Donate Now
            </a>
            <a
              className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-[#f6fbff] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
              href="#"
            >
              View Programs
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
              <img
                alt="Alokayon donation support"
                className="aspect-[5/4] w-full object-cover"
                src="/assets/about/Donation.jpg"
              />
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <img
                alt="Alokayon logo"
                className="h-22 w-22 rounded-full border border-white/85 bg-white/96 object-contain p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.16)] backdrop-blur-sm sm:h-26 sm:w-26 sm:p-2"
                src="/assets/about/Logo.png"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutHero
