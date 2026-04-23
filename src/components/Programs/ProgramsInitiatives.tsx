import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getInitiatives } from './data'

function ProgramsInitiatives() {
  const { t } = useTranslation()
  const initiatives = getInitiatives(t)

  return (
    <section className="bg-white py-20 sm:py-24" id="programs-initiatives">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('programs.initiatives.eyebrow')}
            </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('programs.initiatives.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4" delay={120}>
          {initiatives.map((item) => (
            <article
              className="rounded-[1.2rem] border border-[#dbe7ee] bg-[#fbfdfe] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={item.title}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82]">
                <span className="material-symbols-outlined text-[1.35rem]">
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-4 text-[1rem] font-semibold leading-[1.45] text-[#14324d]">
                {item.title}
              </h3>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default ProgramsInitiatives
