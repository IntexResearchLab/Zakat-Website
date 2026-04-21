import { useEffect, useState } from 'react'
import Reveal from '../reusables/Reveal'
import { testimonials } from './data'

function AboutVoices() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
            Voices of Impact
          </p>
          <h2 className="mt-5 font-serif text-[2.55rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            Real stories behind the work.
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
                  aria-label={`Show testimonial ${index + 1}`}
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
