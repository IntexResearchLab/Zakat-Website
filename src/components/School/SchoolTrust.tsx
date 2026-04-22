import Reveal from '../reusables/Reveal'
import { useTranslation } from 'react-i18next'
import { getSchoolTrustBadges } from './data'

function SchoolTrust() {
  const { t } = useTranslation()
  const schoolTrustBadges = getSchoolTrustBadges(t)

  return (
    <section className="bg-white py-18 sm:py-22">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="rounded-[1.8rem] border border-[#dbe7ee] bg-[linear-gradient(180deg,#ffffff_0%,#f9fcfe_100%)] p-8 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
                {t('school.trust.eyebrow')}
              </p>
              <p className="mt-5 text-[1.03rem] leading-[1.9] text-[#5f7280]">
                {t('school.trust.description')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {schoolTrustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-[#d5e3ec] bg-white px-4 py-2 text-sm font-semibold text-[#516875]"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default SchoolTrust
