import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateTransparency() {
  const { t } = useTranslation()
  const summary = t('donate.transparency.summary', {
    returnObjects: true,
  }) as Array<{ value: string; label: string }>
  const breakdown = t('donate.transparency.breakdown', {
    returnObjects: true,
  }) as Array<{ label: string; value: string; width: string }>

  return (
    <section className="bg-[#fbfdfe] py-20 sm:py-24" id="donate-transparency">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.transparency.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.transparency.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4" delay={100}>
          {summary.map((item) => (
            <div
              className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={item.label}
            >
              <p className="font-serif text-[2.4rem] leading-none tracking-[-0.05em] text-[#14324d]">
                {item.value}
              </p>
              <p className="mt-3 text-[0.95rem] font-semibold leading-[1.65] text-[#647783]">
                {item.label}
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 rounded-[1.5rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8" delay={140}>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.transparency.breakdownTitle')}
          </p>
          <div className="mt-6 space-y-5">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-[0.96rem] font-semibold text-[#4f6778]">{item.label}</p>
                  <p className="text-[0.9rem] font-bold text-[#115b82]">{item.value}</p>
                </div>
                <div className="h-3 rounded-full bg-[#eaf2f7]">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#115b82,#3e89b0)]"
                    style={{ width: item.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonateTransparency
