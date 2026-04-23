import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function HeroCarousel() {
  const { t } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0)
  const slides = t('home.hero.slides', { returnObjects: true }) as Array<{
    image: string
    eyebrow: string
    titleTop: string
    titleBottom: string
    description: string
    alt: string
  }>

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [slides.length])

  const currentSlide = slides[activeSlide]

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[calc(100vh-74px)] min-h-[640px] w-full">
        {slides.map((slide, index) => (
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === activeSlide ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            key={slide.image}
          >
            <img
              alt={slide.alt}
              className={`h-full w-full object-cover ${
                index === activeSlide ? 'hero-image-active' : ''
              }`}
              src={slide.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,76,109,0.88),rgba(17,91,130,0.62),rgba(10,35,54,0.48))]" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
            <div
              className="hero-copy-animate max-w-2xl pl-2 md:pl-10"
              key={currentSlide.image}
            >
              <p className="mb-6 text-sm font-bold uppercase tracking-[0.32em] text-[#ffd86b]">
                {currentSlide.eyebrow}
              </p>
              <h1 className="font-serif text-[2.9rem] font-semibold leading-[0.96] tracking-[-0.04em] text-white md:text-[4.6rem]">
                <span className="block">{currentSlide.titleTop}</span>
                <span className="block italic">{currentSlide.titleBottom}</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-[1.55] text-white/85 md:text-[1rem]">
                {currentSlide.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="hover-lift-soft inline-flex items-center justify-center rounded-full bg-[#f5fbff] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[#115b82] shadow-[0_10px_28px_rgba(6,31,47,0.12)] transition hover:bg-[#dceef8]"
                  to="/donate"
                >
                  {t('common.actions.donateNow')}
                </Link>
                <a
                  className="hover-lift-soft inline-flex items-center justify-center rounded-full border border-white/18 bg-[#8fc7e8]/18 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition hover:bg-[#8fc7e8]/28"
                  href="#home-impact"
                >
                  {t('home.hero.secondaryCta')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
          {slides.map((slide, index) => (
            <button
              aria-label={t('home.hero.goToSlide', { index: index + 1 })}
              className={`h-2.5 rounded-full transition-all ${
                  index === activeSlide ? 'w-10 bg-[#d8f0ff]' : 'w-2.5 bg-white/45 hover:bg-[#d8f0ff]'
                }`}
              key={slide.image}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>

        <button
          aria-label={t('home.hero.previousSlide')}
          className="hover-lift-soft absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0c4c6d]/45 text-2xl text-white backdrop-blur-sm transition hover:bg-[#0c4c6d]/70"
          onClick={() =>
            setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
          }
          type="button"
        >
          ‹
        </button>

        <button
          aria-label={t('home.hero.nextSlide')}
          className="hover-lift-soft absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#0c4c6d]/45 text-2xl text-white backdrop-blur-sm transition hover:bg-[#0c4c6d]/70"
          onClick={() => setActiveSlide((current) => (current + 1) % slides.length)}
          type="button"
        >
          ›
        </button>
      </div>
    </section>
  )
}

export default HeroCarousel
