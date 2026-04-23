import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonatePrograms() {
  const { t } = useTranslation()
  const items = t('donate.programs.items', {
    returnObjects: true,
  }) as Array<{ icon: string; title: string; text: string }>

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.programs.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.programs.title')}
          </h2>
        </Reveal>

        <Reveal className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3" delay={110}>
          {items.map((item) => (
            <div
              className="rounded-[1.25rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
              key={item.title}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7fc] text-[#115b82]">
                <span className="material-symbols-outlined text-[1.55rem]">{item.icon}</span>
              </div>
              <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.05] tracking-[-0.03em] text-[#14324d]">
                {item.title}
              </h3>
              <p className="mt-4 text-[0.98rem] leading-[1.75] text-[#5d6f7b]">{item.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

export default DonatePrograms
