import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getMadrasaTrustPoints } from './data'

function MadrasaLeadership() {
  const { t } = useTranslation()
  const madrasaTrustPoints = getMadrasaTrustPoints(t)

  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-18">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
            {t('madrasa.leadership.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.4rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3.1rem]">
            {t('madrasa.leadership.title')}
          </h2>
          <p className="mt-7 text-[1.02rem] leading-[1.9] text-[#5f6d64]">
            {t('madrasa.leadership.description')}
          </p>

          <div className="mt-8 space-y-4">
            {madrasaTrustPoints.map((point) => (
              <div className="flex items-start gap-3" key={point}>
                <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                  verified
                </span>
                <p className="text-[1rem] leading-[1.75] text-[#4f6258]">{point}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[1.6rem] border border-[#dde5de] bg-white p-6 shadow-[0_18px_40px_rgba(18,28,22,0.06)] sm:p-8">
            <div className="overflow-hidden rounded-[1.4rem]">
              <img
                alt={t('madrasa.leadership.imageAlt')}
                className="aspect-[4/3] w-full object-cover"
                src="/assets/about/person-2.jpg"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1rem] border border-[#e3e8e1] bg-[#fafcf9] px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                  {t('madrasa.leadership.cardOneLabel')}
                </p>
                <p className="mt-2 font-serif text-[1.45rem] leading-tight tracking-[-0.03em] text-[#1f382a]">
                  {t('madrasa.leadership.cardOneTitle')}
                </p>
              </div>
              <div className="rounded-[1rem] border border-[#e3e8e1] bg-[#fafcf9] px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                  {t('madrasa.leadership.cardTwoLabel')}
                </p>
                <p className="mt-2 font-serif text-[1.45rem] leading-tight tracking-[-0.03em] text-[#1f382a]">
                  {t('madrasa.leadership.cardTwoTitle')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaLeadership
