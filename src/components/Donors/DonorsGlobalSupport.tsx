import { useTranslation } from 'react-i18next'
import Reveal from '../reusables/Reveal'
import { getMapPoints } from './data'

function DonorsGlobalSupport() {
  const { t } = useTranslation()
  const mapPoints = getMapPoints(t)

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('donors.globalSupport.eyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.4rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[2.9rem]">
              {t('donors.globalSupport.title')}
            </h2>
            <p className="mt-6 text-[1rem] leading-[1.85] text-[#5f7280]">
              {t('donors.globalSupport.description')}
            </p>
          </div>

          <div className="rounded-[1.6rem] border border-[#dbe7ee] bg-[radial-gradient(circle_at_top,rgba(247,252,255,1),rgba(236,245,250,1)_58%,rgba(229,240,247,1)_100%)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(242,249,253,1),rgba(232,243,249,1))]">
              <div className="absolute inset-[12%_10%] rounded-[45%] border border-[#d1e2ec] opacity-80" />
              <div className="absolute inset-[18%_18%] rounded-[40%] border border-[#d1e2ec] opacity-70" />
              <div className="absolute inset-[24%_28%] rounded-[38%] border border-[#d1e2ec] opacity-60" />

              {mapPoints.map((point) => (
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  key={point.country}
                  style={{ left: point.left, top: point.top }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-full bg-[#115b82] ring-6 ring-[#115b82]/10" />
                    <span className="rounded-full border border-[#d7e6ef] bg-white/95 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#14324d] shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                      {point.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonorsGlobalSupport
