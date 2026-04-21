import Reveal from '../reusables/Reveal'

function MadrasaTrust() {
  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-[1.8rem] border border-[#dde5de] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf9_100%)] p-8 shadow-[0_18px_40px_rgba(18,28,22,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                Transparency You Can Trust
              </p>
              <p className="mt-5 text-[1.03rem] leading-[1.9] text-[#5f6d64]">
                Alokayon supports this madrasa after observing its disciplined
                management, quality of education, balanced curriculum, and full
                transparency in operations. The magazine also describes the
                madrasa’s structured Arabic and Bengali teaching system and its
                organized use of multiple teachers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                'Integrated curriculum',
                'Transparent operations',
                'Structured teaching system',
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#d6ddd7] bg-white px-4 py-2 text-sm font-semibold text-[#56665c]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaTrust
