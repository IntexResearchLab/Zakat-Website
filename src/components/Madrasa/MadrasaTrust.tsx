import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function MadrasaTrust() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-[1.8rem] border border-[#dde5de] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcf9_100%)] p-8 shadow-[0_18px_40px_rgba(18,28,22,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                {t('madrasa.trust.eyebrow')}
              </p>
              <p className="mt-5 text-[1.03rem] leading-[1.9] text-[#5f6d64]">
                {t('madrasa.trust.description')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(t('madrasa.trust.badges', { returnObjects: true }) as string[]).map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#d6ddd7] bg-white px-4 py-2 text-sm font-semibold text-[#56665c]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaTrust
