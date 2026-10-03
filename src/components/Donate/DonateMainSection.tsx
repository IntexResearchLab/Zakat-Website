import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

const policyLinkClass = 'font-semibold text-[#115b82] underline underline-offset-2 hover:text-[#0d4f72]'

function DonateMainSection() {
  const { t } = useTranslation()
  // Payment gateway compliance: donors must actively agree to the policies before paying.
  const [hasAgreedToPolicies, setHasAgreedToPolicies] = useState(false)
  const amountOptions = t('donate.main.amounts', {
    returnObjects: true,
  }) as Array<{ amount: string; label: string }>
  const impactItems = t('donate.main.impactItems', {
    returnObjects: true,
  }) as Array<{ amount: string; text: string }>
  const trustItems = t('donate.main.trustItems', { returnObjects: true }) as string[]
  const paymentMethods = t('donate.main.paymentMethods', { returnObjects: true }) as string[]

  return (
    <section className="bg-white py-20 sm:py-24" id="donate-form">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-12">
        <Reveal>
          <div className="rounded-[1.5rem] border border-[#dbe7ee] bg-[#fbfdfe] p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('donate.main.formEyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.25rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[2.7rem]">
              {t('donate.main.formTitle')}
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {amountOptions.map((option) => (
                <button
                  className="rounded-[1.1rem] border border-[#d7e6ef] bg-white px-5 py-5 text-left transition hover:border-[#115b82] hover:bg-[#f7fbfd]"
                  key={option.amount}
                  type="button"
                >
                  <p className="font-serif text-[1.8rem] leading-none tracking-[-0.04em] text-[#14324d]">
                    {option.amount}
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-[1.55] text-[#647783]">{option.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-7 grid gap-4">
              <input
                className="rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a2ae] focus:border-[#115b82]"
                placeholder={t('common.form.namePlaceholder')}
                type="text"
              />
              <input
                className="rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a2ae] focus:border-[#115b82]"
                placeholder={t('common.form.emailPlaceholder')}
                type="email"
              />
              <input
                className="rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a2ae] focus:border-[#115b82]"
                placeholder={t('common.form.phonePlaceholder')}
                type="tel"
              />
              <select className="rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[1rem] text-[#14324d] outline-none transition focus:border-[#115b82]">
                <option>{t('donate.main.categories.default')}</option>
                <option>{t('donate.main.categories.education')}</option>
                <option>{t('donate.main.categories.healthcare')}</option>
                <option>{t('donate.main.categories.livelihood')}</option>
              </select>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {paymentMethods.map((method) => (
                <span
                  className="rounded-full border border-[#d7e6ef] bg-white px-4 py-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#115b82]"
                  key={method}
                >
                  {method}
                </span>
              ))}
            </div>

            <label className="mt-7 flex items-start gap-3 rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[0.94rem] leading-[1.6] text-[#4f6170]">
              <input
                checked={hasAgreedToPolicies}
                className="mt-1 h-4 w-4 shrink-0 accent-[#13703e]"
                onChange={(event) => setHasAgreedToPolicies(event.target.checked)}
                type="checkbox"
              />
              <span>
                <Trans
                  components={{
                    terms: <Link className={policyLinkClass} rel="noopener" target="_blank" to="/terms-and-conditions" />,
                    privacy: <Link className={policyLinkClass} rel="noopener" target="_blank" to="/privacy-policy" />,
                    refund: <Link className={policyLinkClass} rel="noopener" target="_blank" to="/refund-policy" />,
                  }}
                  i18nKey="donate.main.agreement.text"
                />
              </span>
            </label>
            {!hasAgreedToPolicies ? (
              <p className="mt-2 text-[0.84rem] leading-[1.6] text-[#7a8b95]">
                {t('donate.main.agreement.required')}
              </p>
            ) : null}

            <button
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#9cbfa9] disabled:shadow-none"
              disabled={!hasAgreedToPolicies}
              type="button"
            >
              {t('common.actions.donateNow')}
            </button>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-[1.5rem] border border-[#dbe7ee] bg-white p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('donate.main.impactEyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.15rem] leading-[1.03] tracking-[-0.04em] text-[#14324d] sm:text-[2.55rem]">
              {t('donate.main.impactTitle')}
            </h2>

            <div className="mt-7 space-y-4">
              {impactItems.map((item) => (
                <div
                  className="rounded-[1rem] border border-[#dce7ee] bg-[#fbfdfe] px-5 py-4"
                  key={item.amount}
                >
                  <p className="font-serif text-[1.65rem] leading-none tracking-[-0.04em] text-[#14324d]">
                    {item.amount}
                  </p>
                  <p className="mt-2 text-[0.96rem] leading-[1.7] text-[#60727d]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#e4edf3] pt-6">
              <div className="space-y-3">
                {trustItems.map((item) => (
                  <div className="flex items-start gap-3" key={item}>
                    <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                      task_alt
                    </span>
                    <p className="text-[0.96rem] leading-[1.7] text-[#5f7280]">{item}</p>
                  </div>
                ))}
              </div>

              <a
                className="mt-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:gap-4"
                href="#donate-transparency"
              >
                {t('donate.main.reportLink')}
                <span aria-hidden="true" className="text-lg leading-none">
                  →
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DonateMainSection
