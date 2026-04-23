import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import type { MagazineIssue } from './types'

type TransparencyAtAGlanceProps = {
  latestIssue: MagazineIssue
}

function TransparencyAtAGlance({ latestIssue }: TransparencyAtAGlanceProps) {
  const { t } = useTranslation()
  const highlights = t('transparency.atAGlance.items', {
    returnObjects: true,
  }) as Array<{ icon: string; title: string; description: string }>

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('transparency.atAGlance.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
              {t('transparency.atAGlance.title')}
            </h2>
            <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783]">
              {t('transparency.atAGlance.description')}
            </p>
          </div>

          <Link
            className="inline-flex items-center gap-3 self-start text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4 lg:self-auto"
            to={`/transparency/${latestIssue.year}`}
          >
            {t('transparency.atAGlance.cta')}
            <span aria-hidden="true" className="text-xl leading-none">
              →
            </span>
          </Link>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={120}>
          {highlights.map((item, index) => (
            <article
              className="group rounded-[1.15rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
              key={item.title}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82] transition group-hover:bg-[#115b82] group-hover:text-white">
                  <span className="material-symbols-outlined text-[1.35rem]">
                    {item.icon}
                  </span>
                </span>
                <div>
                  <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#8a9ba7]">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-2 text-[1.05rem] font-bold leading-[1.35] text-[#14324d]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.94rem] leading-[1.65] text-[#647783]">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default TransparencyAtAGlance
