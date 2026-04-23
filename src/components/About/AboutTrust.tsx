import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getTrustPoints } from './data'

function AboutTrust() {
  const { t } = useTranslation()
  const trustPoints = getTrustPoints(t)

  return (
    <section className="bg-[#14324d] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.84fr_1.16fr] lg:gap-20">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#8fd1f2]">
              {t('about.trust.eyebrow', 'How We Work')}
            </p>
            <h2 className="mt-5 max-w-lg font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-white sm:text-[3.05rem]">
              {t(
                'about.trust.title',
                'Trust is built through clarity, discipline, and community care.'
              )}
            </h2>
          </Reveal>

          <Reveal className="grid gap-4 sm:grid-cols-2" delay={100}>
            {trustPoints.map((point) => (
              <div
                className="rounded-[1.15rem] border border-white/10 bg-white/6 px-6 py-5 text-[1rem] leading-[1.7] text-white/88"
                key={point}
              >
                {point}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default AboutTrust
