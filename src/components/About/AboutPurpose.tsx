import { useEffect, useState } from 'react'
import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getImpactStats } from './data'

function AboutPurpose() {
  const { t } = useTranslation()
  const impactStats = getImpactStats(t)
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const storySections = t('about.purpose.story.sections', {
    returnObjects: true,
  }) as Array<{ title: string; paragraphs: string[] }>

  useEffect(() => {
    if (!isStoryOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsStoryOpen(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isStoryOpen])

  return (
    <>
      <section className="bg-white py-18 sm:py-22">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('about.purpose.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.55rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3.2rem]">
              {t('about.purpose.title')}
            </h2>
            <div className="mx-auto mt-8 max-w-4xl space-y-5 text-[1.06rem] leading-[1.85] text-[#516573] sm:text-[1.1rem]">
              <p>
                {t('about.purpose.paragraphOne')}
              </p>
              <p>
                {t('about.purpose.paragraphTwoPrefix')}{' '}
                <span className="text-[#8b9aa5]">{t('about.purpose.paragraphTwoEmphasis')}</span>
              </p>
            </div>
            <button
              className="mt-8 inline-flex items-center gap-3 text-[0.95rem] font-bold uppercase tracking-[0.16em] text-[#115b82] underline decoration-[#b8d0de] decoration-1 underline-offset-[6px] transition hover:gap-4"
              onClick={() => setIsStoryOpen(true)}
              type="button"
            >
              {t('common.actions.readOurStory')}
              <span aria-hidden="true" className="text-xl leading-none">
                →
              </span>
            </button>
          </Reveal>
          <Reveal className="mt-14" delay={100}>
            <div className="mx-auto max-w-5xl border-t border-[#d9e6ee] pt-10">
              <div className="grid gap-y-10 text-left md:grid-cols-2 md:gap-x-12 xl:grid-cols-4 xl:gap-x-16">
                {impactStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-serif text-[2.7rem] leading-none tracking-[-0.05em] text-[#14324d] sm:text-[3.3rem]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[0.9rem] font-semibold tracking-[0.02em] text-[#697b86]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {isStoryOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#09131ccc]/82 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsStoryOpen(false)}
          role="dialog"
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close story"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[#14324d] shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition hover:bg-white"
              onClick={() => setIsStoryOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[1.25rem]">close</span>
            </button>

            <div className="max-h-[86vh] overflow-y-auto rounded-[1.45rem] border border-[#dce7ee] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.22)] sm:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {t('about.purpose.story.eyebrow')}
              </p>
              <h3 className="mt-4 font-serif text-[2.3rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                {t('about.purpose.story.title')}
              </h3>
              <p className="mt-5 max-w-2xl text-[1rem] leading-[1.8] text-[#647783]">
                {t('about.purpose.story.intro')}
              </p>

              <div className="mt-8 space-y-8">
                {storySections.map((section) => (
                  <section key={section.title}>
                    <h4 className="font-serif text-[1.5rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
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
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default AboutPurpose
