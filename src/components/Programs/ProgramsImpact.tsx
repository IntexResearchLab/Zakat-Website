import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getImpactHighlights } from './data'

function ProgramsImpact() {
  const { t } = useTranslation()
  const impactHighlights = getImpactHighlights(t)

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('programs.impact.eyebrow')}
            </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('programs.impact.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" delay={120}>
          {impactHighlights.map((item) => (
            <div
              className="rounded-[1.2rem] border border-[#dbe7ee] bg-[#fbfdfe] px-6 py-7 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={item.label}
            >
              <p className="font-serif text-[2.55rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3rem]">
                {item.value}
              </p>
              <p className="mt-3 text-[0.92rem] font-semibold leading-[1.45] text-[#697b86]">
                {item.label}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsImpact
