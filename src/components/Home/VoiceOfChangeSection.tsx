import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'

function VoiceOfChangeSection() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const testimonials = t('home.voices.testimonials', {
    returnObjects: true,
  }) as Array<{ category: string; quote: string; name: string; role: string; location: string }>

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const activeTestimonial = testimonials[activeIndex]

  const handlePrevious = () => {
    setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % testimonials.length)
  }

  return (
    <section className="bg-[#f9fdff] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
            {t('home.voices.eyebrow')}
          </p>
          <h2 className="mx-auto max-w-3xl font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            {t('home.voices.title')}
          </h2>
        </Reveal>

        <Reveal
          className="mt-10 rounded-[1.35rem] border border-[#d7e4ed] bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8"
          delay={120}
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {activeTestimonial.category}
              </p>
              <div className="hidden items-center gap-2 sm:flex">
                {testimonials.map((testimonial, index) => (
                  <button
                    aria-label={t('home.voices.showTestimonial', { index: index + 1 })}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? 'w-8 bg-[#115b82]'
                        : 'w-2.5 bg-[#d3e1ea] hover:bg-[#b8cddd]'
                    }`}
                    key={testimonial.category}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <p className="font-serif text-[1.16rem] italic leading-[1.7] text-[#27465f] sm:text-[1.28rem]">
              “{activeTestimonial.quote}”
            </p>

            <div className="flex flex-col gap-4 border-t border-[#e7eef3] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-bold text-[#14324d]">
                  {activeTestimonial.name}
                </p>
                <p className="mt-1 text-sm text-[#6b7a86]">
                  {activeTestimonial.role}
                  {activeTestimonial.location ? `, ${activeTestimonial.location}` : ''}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                  aria-label={t('home.voices.previous')}
                  className="hover-lift-soft flex h-9 w-9 items-center justify-center rounded-full border border-[#d8e5ee] bg-[#fbfdff] text-[#7b8b96] transition hover:border-[#c4d8e6] hover:text-[#14324d]"
                  onClick={handlePrevious}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label={t('home.voices.next')}
                  className="hover-lift-soft flex h-9 w-9 items-center justify-center rounded-full border border-[#d8e5ee] bg-[#fbfdff] text-[#7b8b96] transition hover:border-[#c4d8e6] hover:text-[#14324d]"
                  onClick={handleNext}
                  type="button"
                >
                  →
                </button>
              </div>
            </div>

            <a
              className="inline-flex items-center gap-3 self-start text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4"
              href="#"
            >
              {t('home.voices.cta')}
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default VoiceOfChangeSection
