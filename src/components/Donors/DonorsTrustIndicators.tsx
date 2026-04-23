import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getDonorTrustIndicators } from './data'

function DonorsTrustIndicators() {
  const { t } = useTranslation()
  const indicators = getDonorTrustIndicators(t)

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-4 border-y border-[#dbe7ee] py-6 sm:grid-cols-2 xl:grid-cols-4">
          {indicators.map((item) => (
            <div className="flex items-center gap-3" key={item.label}>
              <span className="material-symbols-outlined text-[1.2rem] text-[#2d8a57]">
                {item.icon}
              </span>
              <p className="text-[0.95rem] font-semibold leading-[1.6] text-[#4e6577]">
                {item.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsTrustIndicators
