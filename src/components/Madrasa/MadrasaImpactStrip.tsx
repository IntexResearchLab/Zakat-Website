import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getMadrasaImpactStats } from './data'

function MadrasaImpactStrip() {
  const { t } = useTranslation()
  const madrasaImpactStats = getMadrasaImpactStats(t)

  return (
    <section className="border-b border-[#dfe6dc] bg-[#fafbf8]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Reveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {madrasaImpactStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#1f382a] sm:text-[2.35rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.92rem] font-medium leading-[1.6] text-[#627168]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaImpactStrip
