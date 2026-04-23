import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

function FounderMessageSection() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const storySections = t('home.founder.modal.sections', {
    returnObjects: true,
  }) as Array<{ title: string; paragraphs: string[] }>

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <>
      <section className="bg-[#fcfbf8] py-22 sm:py-26">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-18">
          <Reveal>
            <div className="overflow-hidden rounded-[1.35rem] border border-[#dfe8ed] bg-white p-3 shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
              <img
                alt={t('home.founder.imageAlt')}
                className="aspect-[4/5] w-full rounded-[1rem] object-cover"
                src="/assets/about/person-1.jpg"
              />
            </div>
          </Reveal>

          <Reveal className="max-w-[43rem]" delay={120}>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('home.founder.eyebrow')}
            </p>
            <p className="mt-4 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#6e7d73]">
              {t('home.founder.context')}
            </p>
            <h2 className="mt-5 font-serif text-[2.45rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.05rem]">
              {t('home.founder.title')}
            </h2>

            <div className="mt-8 max-w-[39rem] space-y-5 text-[1rem] leading-[1.82] text-[#5f7280] sm:text-[1.05rem]">
              <p>{t('home.founder.excerptOne')}</p>
              <p>{t('home.founder.excerptTwo')}</p>
            </div>

            <div className="mt-8 border-l-2 border-[#d9e4eb] pl-5">
              <p className="font-serif text-[1.3rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('home.founder.name')}
              </p>
              <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#6a7c87]">
                {t('home.founder.role')}
              </p>
            </div>

            <button
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#c8dcea] bg-[#f7fbfd] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4 hover:border-[#abcbe0] hover:bg-[#edf7fc]"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              {t('common.actions.readFullMessage')}
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </button>
          </Reveal>
        </div>
      </section>

      {isOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#09131ccc]/82 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close founder message"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#14324d] shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition hover:bg-white"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">close</span>
            </button>

            <div className="max-h-[86vh] overflow-y-auto rounded-[1.45rem] border border-[#dce7ee] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:p-9">
              <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
                <div>
                  <div className="overflow-hidden rounded-[1.2rem] border border-[#dfe8ed] bg-[#fbfdff] p-3">
                    <img
                      alt={t('home.founder.imageAlt')}
                      className="aspect-[4/5] w-full rounded-[0.95rem] object-cover"
                      src="/assets/about/person-1.jpg"
                    />
                  </div>
                  <div className="mt-5 border-l-2 border-[#d9e4eb] pl-4">
                    <p className="font-serif text-[1.2rem] leading-none tracking-[-0.03em] text-[#14324d]">
                      {t('home.founder.name')}
                    </p>
                    <p className="mt-2 text-[0.93rem] leading-[1.6] text-[#6a7c87]">
                      {t('home.founder.role')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                    {t('home.founder.eyebrow')}
                  </p>
                  <h3 className="mt-4 font-serif text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[2.8rem]">
                    {t('home.founder.modal.title')}
                  </h3>
                  <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783]">
                    {t('home.founder.modal.intro')}
                  </p>

                  <div className="mt-8 space-y-8">
                    {storySections.map((section) => (
                      <section key={section.title}>
                        <h4 className="font-serif text-[1.45rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
                          {section.title}
                        </h4>
                        <div className="mt-3 space-y-4 text-[0.98rem] leading-[1.8] text-[#5f7280]">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link
                      className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82] transition hover:gap-4"
                      onClick={() => setIsOpen(false)}
                      to="/transparency"
                    >
                      {t('common.actions.readOurMagazine')}
                      <span aria-hidden="true" className="text-xl leading-none">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default FounderMessageSection
