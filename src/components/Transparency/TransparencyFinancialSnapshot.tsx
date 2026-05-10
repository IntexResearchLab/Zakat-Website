import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getTransparencyFinancialNumbers } from '../../content/stats'
import { usePublicStats } from '../../lib/publicStats'

function TransparencyFinancialSnapshot() {
  const { t } = useTranslation()
  usePublicStats()
  const numbers = getTransparencyFinancialNumbers(t)
  const breakdown = t('transparency.financial.breakdown', {
    returnObjects: true,
  }) as Array<{ label: string; width: string }>

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('transparency.financial.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('transparency.financial.title')}
          </h2>
          <p className="mt-5 max-w-xl text-[1rem] leading-[1.8] text-[#647783]">
            {t('transparency.financial.description')}
          </p>
        </Reveal>

        <Reveal className="rounded-[1.5rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)] sm:p-8" delay={120}>
          <div className="grid gap-5 sm:grid-cols-2">
            {numbers.map((item) => (
              <div className="rounded-[1rem] bg-white p-5" key={item.label}>
                <p className="font-serif text-[2.35rem] leading-none tracking-[-0.05em] text-[#14324d]">
                  {item.value}
                </p>
                <p className="mt-3 text-[0.92rem] font-semibold leading-[1.55] text-[#647783]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-4">
            {breakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-[0.92rem] font-semibold text-[#4f6778]">{item.label}</p>
                  <p className="text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                    {item.width}
                  </p>
                </div>
                <div className="h-2.5 rounded-full bg-[#eaf2f7]">
                  <div
                    className="h-2.5 rounded-full bg-[linear-gradient(90deg,#115b82,#3e89b0)]"
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

export default TransparencyFinancialSnapshot
