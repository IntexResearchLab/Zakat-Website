import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getTestimonials } from './data'

function AboutVoices() {
  const { t } = useTranslation()
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const testimonials = getTestimonials(t)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [testimonials.length])

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            {t('about.voices.eyebrow', 'Voices of Impact')}
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('about.voices.title', 'Real stories behind the work.')}
          </h2>
        </Reveal>

        <Reveal
          className="mt-10 rounded-[1.3rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-8"
          delay={120}
        >
          <p className="font-serif text-[1.35rem] italic leading-[1.65] text-[#26455f] sm:text-[1.55rem]">
            “{testimonials[activeTestimonial].quote}”
          </p>

          <div className="mt-7 flex flex-col gap-4 border-t border-[#e7eef3] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#5f7280]">
              {testimonials[activeTestimonial].author}
            </p>

            <div className="flex items-center gap-3">
              {testimonials.map((item, index) => (
                <button
                  aria-label={t('about.voices.showTestimonial', {
                    defaultValue: 'Show testimonial {{index}}',
                    index: index + 1,
                  })}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeTestimonial
                      ? 'w-8 bg-[#115b82]'
                      : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                  }`}
                  key={item.author}
                  onClick={() => setActiveTestimonial(index)}
                  type="button"
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutVoices
