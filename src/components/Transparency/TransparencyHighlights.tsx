import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function TransparencyHighlights() {
  const { t } = useTranslation()
  const highlights = t('transparency.highlights.items', {
    returnObjects: true,
  }) as Array<{ title: string; description: string; icon: string }>

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-5 px-6 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item, index) => (
          <Reveal
            className="rounded-[1.15rem] border border-[#dbe7ee] bg-[#fbfdfe] p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
            delay={index * 45}
            key={item.title}
          >
            <span className="material-symbols-outlined text-[1.55rem] text-[#115b82]">
              {item.icon}
            </span>
            <h2 className="mt-4 text-[1rem] font-bold leading-[1.35] text-[#14324d]">
              {item.title}
            </h2>
            <p className="mt-2 text-[0.92rem] leading-[1.65] text-[#647783]">
              {item.description}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default TransparencyHighlights
