import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateTrustBlock() {
  const { t } = useTranslation()
  const points = t('donate.trustBlock.points', {
    returnObjects: true,
  }) as string[]

  return (
    <section className="bg-[#f8fbfd] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-16">
        <Reveal className="max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.trustBlock.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.45rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.trustBlock.title')}
          </h2>
          <p className="mt-6 text-[1rem] leading-[1.85] text-[#60727d]">
            {t('donate.trustBlock.description')}
          </p>
        </Reveal>

        <Reveal className="grid gap-4 sm:grid-cols-2" delay={110}>
          {points.map((point) => (
            <div
              className="rounded-[1.15rem] border border-[#dbe7ee] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={point}
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5 text-[1.05rem] text-[#2d8a57]">
                  verified
                </span>
                <p className="text-[0.96rem] leading-[1.75] text-[#516777]">{point}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonateTrustBlock
