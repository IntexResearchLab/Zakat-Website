import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function DonateMethods() {
  const { t } = useTranslation()
  const mobileMethods = t('donate.methods.mobile', {
    returnObjects: true,
  }) as Array<{ title: string; value: string }>
  const bankItems = t('donate.methods.bank.items', {
    returnObjects: true,
  }) as Array<{ label: string; value: string }>
  const trustItems = t('donate.methods.trust', { returnObjects: true }) as string[]

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('donate.methods.eyebrow')}
          </p>
          <h2 className="mt-5 font-serif text-[2.5rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('donate.methods.title')}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="grid gap-5 sm:grid-cols-2" delay={100}>
            {mobileMethods.map((item) => (
              <div
                className="rounded-[1.2rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                key={item.title}
              >
                <p className="text-[0.82rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {item.title}
                </p>
                <p className="mt-3 font-serif text-[1.8rem] leading-none tracking-[-0.04em] text-[#14324d]">
                  {item.value}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal
            className="rounded-[1.4rem] border border-[#dbe7ee] bg-[#fbfdfe] p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8"
            delay={120}
          >
            <p className="text-[0.82rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
              {t('donate.methods.bank.title')}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {bankItems.map((item) => (
                <div key={item.label}>
                  <p className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#7a8f9d]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[0.98rem] leading-[1.7] text-[#14324d]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#e4edf3] pt-6 space-y-3">
              {trustItems.map((item) => (
                <div className="flex items-start gap-3" key={item}>
                  <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                    task_alt
                  </span>
                  <p className="text-[0.96rem] leading-[1.7] text-[#5f7280]">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default DonateMethods
