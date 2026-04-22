import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getPurposeSections } from './data'

function AboutPurposeSections() {
  const { t } = useTranslation()
  const purposeSections = getPurposeSections(t)

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl space-y-18 px-6 sm:space-y-22">
        {purposeSections.map((section, index) => (
          <Reveal
            className={`grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:gap-16 ${
              index % 2 === 1 ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''
            }`}
            delay={index * 80}
            key={section.eyebrow}
          >
            <div className="relative">
              <div className="overflow-hidden rounded-[1.5rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                <img
                  alt={section.imageAlt}
                  className="aspect-[5/4] w-full object-cover"
                  src={section.image}
                />
              </div>
              <div className="absolute -bottom-6 right-4 hidden w-[32%] overflow-hidden rounded-[1.35rem] border-[6px] border-white bg-white shadow-[0_16px_36px_rgba(15,23,42,0.12)] sm:block lg:right-6">
                <img
                  alt=""
                  className="aspect-[4/5] w-full object-cover"
                  src={section.secondaryImage}
                />
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {section.eyebrow}
              </p>
              <h3 className="mt-4 font-serif text-[2.45rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                {section.title}
              </h3>
              <p className="mt-6 text-[1rem] leading-[1.85] text-[#5c6f7b] sm:text-[1.04rem]">
                {section.text}
              </p>

              <div className="mt-7 space-y-4 border-t border-[#dce7ee] pt-6">
                {section.bullets.map((item) => (
                  <div className="flex items-start gap-3" key={item}>
                    <span className="material-symbols-outlined mt-0.5 text-[1.1rem] text-[#2d8a57]">
                      task_alt
                    </span>
                    <p className="text-[0.98rem] leading-[1.7] text-[#4f6472]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

export default AboutPurposeSections
