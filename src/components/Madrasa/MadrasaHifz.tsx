import Reveal from '../reusables/Reveal'

function MadrasaHifz() {
  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-[1.8rem] border border-[#dde5de] bg-white p-8 shadow-[0_18px_40px_rgba(18,28,22,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                Qur’an Memorization Program (Hifz)
              </p>
              <h2 className="mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3rem]">
                A focused path of memorization and character formation.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  31
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  Students currently memorizing Qur’an
                </p>
              </div>
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  Boys + Girls
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  Participation across both groups
                </p>
              </div>
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  2
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  Recent graduates: 1 male and 1 female Hafiz
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaHifz
