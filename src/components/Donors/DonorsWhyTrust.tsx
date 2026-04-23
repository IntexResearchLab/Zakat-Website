import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getWhyTrustPoints } from './data'

function DonorsWhyTrust() {
  const { t } = useTranslation()
  const points = getWhyTrustPoints(t)

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-10 lg:grid-cols-[0.76fr_1.24fr] lg:items-start lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('donors.whyTrust.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('donors.whyTrust.title')}
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.85] text-[#5f7280]">
              {t('donors.whyTrust.description')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <Reveal
                className="rounded-[1.2rem] border border-[#dbe7ee] bg-[#fbfdfe] px-6 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.03)]"
                key={point}
                delay={90}
              >
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                    task_alt
                  </span>
                  <p className="text-[0.98rem] leading-[1.72] text-[#58708a]">{point}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsWhyTrust
