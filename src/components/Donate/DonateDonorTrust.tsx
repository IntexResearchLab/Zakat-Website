import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateDonorTrust() {
  const { t } = useTranslation()
  const quotes = t('donate.donorTrust.items', {
    returnObjects: true,
  }) as Array<{ quote: string; name: string; role: string }>

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.donorTrust.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.donorTrust.title')}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal className="rounded-[1.55rem] border border-[#dbe7ee] bg-[linear-gradient(180deg,#fbfdfe_0%,#f5fafd_100%)] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-10">
            <p className="font-serif text-[1.45rem] italic leading-[1.75] text-[#27465f] sm:text-[1.62rem]">
              “{quotes[0]?.quote}”
            </p>
            <div className="mt-7 border-t border-[#dfe8ee] pt-5">
              <p className="text-[1rem] font-bold text-[#14324d]">{quotes[0]?.name}</p>
              <p className="mt-1 text-[0.95rem] leading-[1.7] text-[#61727d]">{quotes[0]?.role}</p>
            </div>
          </Reveal>

          <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1" delay={100}>
            {quotes.slice(1).map((quote) => (
              <article
                className="rounded-[1.2rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                key={quote.name}
              >
                <p className="font-serif text-[1.1rem] italic leading-[1.75] text-[#27465f]">
                  “{quote.quote}”
                </p>
                <div className="mt-5 border-t border-[#e4edf3] pt-4">
                  <p className="text-[0.98rem] font-bold text-[#14324d]">{quote.name}</p>
                  <p className="mt-1 text-[0.9rem] leading-[1.65] text-[#627581]">{quote.role}</p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default DonateDonorTrust
