import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getSchoolImpactStats } from './data'

function SchoolImpactStrip() {
  const { t } = useTranslation()
  const schoolImpactStats = getSchoolImpactStats(t)

  return (
    <section className="border-b border-[#dbe7ee] bg-[#fbfdfe]">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Reveal className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {schoolImpactStats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[2.4rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.92rem] font-medium leading-[1.6] text-[#647784]">
                {stat.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolImpactStrip
