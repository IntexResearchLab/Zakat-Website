import Reveal from '../reusables/Reveal'

function MadrasaHero() {
  return (
    <section className="border-b border-[#d9dfd5] bg-[linear-gradient(180deg,#fcfcf9_0%,#f6f7f1_100%)]">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-20 lg:py-20">
        <Reveal className="max-w-2xl">
          <p className="text-[1rem] font-medium tracking-[-0.01em] text-[#69756b]">
            [Home / <span className="text-[#b38a2f]">Programs</span> /{' '}
            <span className="text-[#b38a2f]">Madrasa</span>]
          </p>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            Alokayon Madrasa Initiative
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[3rem] font-semibold leading-[0.98] tracking-[-0.05em] text-[#1e3427] sm:text-[4.15rem]">
            Abdul Karim Miazi Hafezi Madrasa
          </h1>
          <p className="mt-7 max-w-[35rem] text-[1.03rem] leading-[1.9] text-[#58675e] sm:text-[1.06rem]">
            A distinctive educational institution integrating Arabic and Bengali
            education to shape students in faith, discipline, and practical
            academic readiness.
          </p>
          <p className="mt-5 text-[0.98rem] font-medium text-[#6b756e]">
            Sompara, Chatkhil, Noakhali
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#2f6a52] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(47,106,82,0.18)] transition hover:bg-[#275843]"
              href="#"
            >
              Donate Now
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#d8dfd8] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6a52] transition hover:border-[#c4d2ca] hover:bg-[#f8fbf8]"
              href="#"
            >
              Support a Student
            </a>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="relative">
            <div className="overflow-hidden rounded-[1.8rem] shadow-[0_24px_60px_rgba(18,28,22,0.12)]">
              <img
                alt="Students studying at the madrasa"
                className="aspect-[5/4] w-full object-cover"
                src="/assets/home/carousel-2.jpg"
              />
            </div>

            <div className="absolute bottom-5 right-5 rounded-[1rem] border border-white/80 bg-white/92 px-5 py-4 shadow-[0_18px_36px_rgba(18,28,22,0.15)] backdrop-blur-sm">
              <p className="font-serif text-[1.9rem] leading-none tracking-[-0.05em] text-[#1e3427]">
                31
              </p>
              <p className="mt-2 max-w-[10rem] text-sm font-semibold leading-[1.5] text-[#5d6d63]">
                Students currently memorizing Qur’an
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaHero
