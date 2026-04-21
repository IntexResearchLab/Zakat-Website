import Reveal from '../reusables/Reveal'

function MadrasaCta() {
  return (
    <section className="border-t border-[#dde5de] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf9_55%,#f7f8f3_100%)]">
      <div className="mx-auto max-w-7xl px-6 py-18 text-center sm:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            Be part of a lasting impact
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[0.98] tracking-[-0.05em] text-[#1f382a] sm:text-[4rem]">
            Help knowledge, faith, and dignity grow together.
          </h2>
          <p className="mx-auto mt-6 max-w-[42rem] text-[1.02rem] leading-[1.85] text-[#5f6d64]">
            Support this institution through zakat and donations, and help build
            a future where disciplined learning and spiritual growth remain
            accessible to children from underprivileged backgrounds.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              className="inline-flex items-center justify-center rounded-full bg-[#2f6a52] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_34px_rgba(47,106,82,0.18)] transition hover:bg-[#275843]"
              href="#"
            >
              Donate Now
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[#d6ddd7] bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#2f6a52] transition hover:border-[#c4d2ca] hover:bg-[#f8fbf8]"
              href="#"
            >
              Sponsor a Student
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaCta
