import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'

function MadrasaHifz() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#fafbf8] py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-[1.8rem] border border-[#dde5de] bg-white p-8 shadow-[0_18px_40px_rgba(18,28,22,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2f6a52]">
                {t('madrasa.hifz.eyebrow')}
              </p>
              <h2 className="mt-5 font-serif text-[2.35rem] leading-[1.02] tracking-[-0.04em] text-[#1f382a] sm:text-[3rem]">
                {t('madrasa.hifz.title')}
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  {t('madrasa.hifz.statOne.value')}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  {t('madrasa.hifz.statOne.label')}
                </p>
              </div>
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  {t('madrasa.hifz.statTwo.value')}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  {t('madrasa.hifz.statTwo.label')}
                </p>
              </div>
              <div>
                <p className="font-serif text-[2.6rem] leading-none tracking-[-0.05em] text-[#1f382a]">
                  {t('madrasa.hifz.statThree.value')}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#5f6d64]">
                  {t('madrasa.hifz.statThree.label')}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MadrasaHifz
