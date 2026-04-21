import { useEffect, useState } from 'react'

const testimonials = [
  {
    category: 'Impact Story',
    quote:
      'As a beneficiary, my family and I are deeply grateful to Alokayon. During difficult times, they supported us with education, medical care, and food assistance.',
    name: 'Md. Omar Faruque',
    role: 'Assistant Manager, BRAC',
    location: '',
  },
  {
    category: 'Credibility',
    quote:
      'I was inspired by the transparency and accountability of Alokayon. Seeing how donations are used sincerely for those in need made me stay connected with their work.',
    name: 'Monitoring & Evaluation Specialist',
    role: 'World Bank',
    location: '',
  },
  {
    category: 'Education Impact',
    quote:
      'The financial support I received from Alokayon made my educational journey possible. Their help reduced the burden on my family and allowed me to continue my studies.',
    name: 'Student',
    role: 'Chittagong University',
    location: '',
  },
]

function VoiceOfChangeSection() {
  const [activeIndex, setActiveIndex] = useState(0)

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
        <div className="text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#115b82]">
            Voices of Impact
          </p>
          <h2 className="mx-auto max-w-3xl font-serif text-[2.5rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
            Real stories from our community
          </h2>
        </div>

        <div className="mt-10 rounded-[1.35rem] border border-[#d7e4ed] bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {activeTestimonial.category}
              </p>
              <div className="hidden items-center gap-2 sm:flex">
                {testimonials.map((testimonial, index) => (
                  <button
                    aria-label={`Show testimonial ${index + 1}`}
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
                  aria-label="Previous voice"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8e5ee] bg-[#fbfdff] text-[#7b8b96] transition hover:border-[#c4d8e6] hover:text-[#14324d]"
                  onClick={handlePrevious}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Next voice"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d8e5ee] bg-[#fbfdff] text-[#7b8b96] transition hover:border-[#c4d8e6] hover:text-[#14324d]"
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
              Read more real stories in our magazine
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VoiceOfChangeSection
