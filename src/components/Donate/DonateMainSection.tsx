import { useState, type FormEvent } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import Reveal from '../reusables/Reveal'

const policyLinkClass =
  'font-semibold text-[#115b82] underline underline-offset-2 hover:text-[#0d4f72]'
const fieldClass =
  'rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'

const labelClass = 'text-[0.88rem] font-semibold text-[#14324d]'

const MIN_DONATION_BDT = 10
const MAX_DONATION_BDT = 500000
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const categoryKeys = ['default', 'zakat', 'education', 'healthcare', 'livelihood'] as const
type CategoryKey = (typeof categoryKeys)[number]

// Amount labels are translated text such as "৳1000" or "৳১০০০"; options without digits are "custom".
const parseAmountLabel = (label: string) => {
  const latinDigits = label.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)))
  const digits = latinDigits.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

type DonateErrorKey = 'amount' | 'name' | 'email' | 'phone' | 'gateway' | 'generic'

function DonateMainSection() {
  const { t } = useTranslation()
  const amountOptions = t('donate.main.amounts', {
    returnObjects: true,
  }) as Array<{ amount: string; label: string }>
  const impactItems = t('donate.main.impactItems', {
    returnObjects: true,
  }) as Array<{ amount: string; text: string }>
  const trustItems = t('donate.main.trustItems', { returnObjects: true }) as string[]
  const paymentMethods = t('donate.main.paymentMethods', { returnObjects: true }) as string[]

  // The zakat calculator links here with ?amount=…&category=zakat to prefill the form.
  const [searchParams] = useSearchParams()
  const presetAmount = Number(searchParams.get('amount'))
  const hasPresetAmount =
    Number.isFinite(presetAmount) && presetAmount >= MIN_DONATION_BDT && presetAmount <= MAX_DONATION_BDT
  const customOptionIndex = amountOptions.findIndex((option) => parseAmountLabel(option.amount) === null)
  const presetCategory = categoryKeys.find((key) => key === searchParams.get('category'))

  const [selectedOption, setSelectedOption] = useState(
    hasPresetAmount && customOptionIndex >= 0 ? customOptionIndex : 1,
  )
  const [customAmount, setCustomAmount] = useState(hasPresetAmount ? String(presetAmount) : '')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState<CategoryKey>(presetCategory ?? 'default')
  // Payment gateway compliance: donors must actively agree to the policies before paying.
  const [hasAgreedToPolicies, setHasAgreedToPolicies] = useState(false)
  const [wantsSignedReceipt, setWantsSignedReceipt] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorKey, setErrorKey] = useState<DonateErrorKey | null>(null)

  const selectedPreset = parseAmountLabel(amountOptions[selectedOption]?.amount ?? '')
  const isCustomAmount = selectedPreset === null
  const amount = isCustomAmount ? Number(customAmount) : selectedPreset

  const validate = (): DonateErrorKey | null => {
    if (!Number.isFinite(amount) || amount < MIN_DONATION_BDT || amount > MAX_DONATION_BDT) {
      return 'amount'
    }
    if (!name.trim()) {
      return 'name'
    }
    if (!emailPattern.test(email.trim())) {
      return 'email'
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return 'phone'
    }
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validate()
    if (validationError) {
      setErrorKey(validationError)
      return
    }

    setErrorKey(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category,
          signedReceipt: wantsSignedReceipt,
        }),
      })
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string }

      if (response.ok && data.url) {
        // Hand the donor over to the SSLCommerz hosted payment page.
        window.location.assign(data.url)
        return
      }

      const serverErrors: Record<string, DonateErrorKey> = {
        invalid_amount: 'amount',
        invalid_donor: 'name',
        gateway_unavailable: 'gateway',
        unavailable: 'gateway',
      }
      setErrorKey(serverErrors[data.error ?? ''] ?? 'generic')
    } catch {
      setErrorKey('generic')
    }

    setIsSubmitting(false)
  }

  return (
    <section className="bg-white py-20 sm:py-24" id="donate-form">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-12">
        <Reveal>
          <form
            className="rounded-[1.5rem] border border-[#dbe7ee] bg-[#fbfdfe] p-7 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-8"
            noValidate
            onSubmit={(event) => void handleSubmit(event)}
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
              {t('donate.main.formEyebrow')}
            </p>
            <h2 className="mt-5 font-serif text-[2.25rem] leading-[1.02] tracking-[-0.04em] text-[#14324d] sm:text-[2.7rem]">
              {t('donate.main.formTitle')}
            </h2>

            <div
              aria-label={t('donate.main.amountGroupLabel')}
              className="mt-7 grid gap-4 sm:grid-cols-2"
              role="radiogroup"
            >
              {amountOptions.map((option, index) => {
                const isSelected = index === selectedOption

                return (
                  <button
                    aria-checked={isSelected}
                    className={`rounded-[1.1rem] border px-5 py-5 text-left transition ${
                      isSelected
                        ? 'border-[#115b82] bg-[#eef7fc] ring-2 ring-[#115b82]/20'
                        : 'border-[#d7e6ef] bg-white hover:border-[#115b82] hover:bg-[#f7fbfd]'
                    }`}
                    key={option.amount}
                    onClick={() => {
                      setSelectedOption(index)
                      setErrorKey(null)
                    }}
                    role="radio"
                    type="button"
                  >
                    <p className="font-serif text-[1.8rem] leading-none tracking-[-0.04em] text-[#14324d]">
                      {option.amount}
                    </p>
                    <p className="mt-2 text-[0.92rem] leading-[1.55] text-[#647783]">
                      {option.label}
                    </p>
                  </button>
                )
              })}
            </div>

            {isCustomAmount ? (
              <label className="mt-4 block">
                <span className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                  {t('donate.main.customAmountLabel')}
                </span>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#627581]">
                    ৳
                  </span>
                  <input
                    className={`${fieldClass} w-full pl-9`}
                    inputMode="numeric"
                    max={MAX_DONATION_BDT}
                    min={MIN_DONATION_BDT}
                    onChange={(event) => setCustomAmount(event.target.value.replace(/[^\d.]/g, ''))}
                    placeholder={t('donate.main.customAmountPlaceholder')}
                    type="text"
                    value={customAmount}
                  />
                </div>
              </label>
            ) : null}

            <p className="mt-4 text-[0.92rem] leading-[1.6] text-[#4f6170]">
              {t('donate.main.calculatorPrompt')}{' '}
              <Link className={policyLinkClass} to="/zakat-calculator">
                {t('donate.main.calculatorLink')}
              </Link>
            </p>

            <div className="mt-7 grid gap-4">
              <label className="grid gap-2">
                <span className={labelClass}>{t('common.form.nameLabel')}</span>
                <input
                  autoComplete="name"
                  className={fieldClass}
                  id="donate-name"
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t('common.form.namePlaceholder')}
                  required
                  type="text"
                  value={name}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>{t('common.form.emailLabel')}</span>
                <input
                  autoComplete="email"
                  className={fieldClass}
                  id="donate-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('common.form.emailPlaceholder')}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>{t('common.form.phoneLabel')}</span>
                <input
                  autoComplete="tel"
                  className={fieldClass}
                  id="donate-phone"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder={t('common.form.phonePlaceholder')}
                  required
                  type="tel"
                  value={phone}
                />
              </label>
              <label className="grid gap-2">
                <span className={labelClass}>{t('donate.main.categoryLabel')}</span>
                <select
                  className={fieldClass}
                  id="donate-category"
                  onChange={(event) =>
                    setCategory(event.target.value as CategoryKey)
                  }
                  value={category}
                >
                  {categoryKeys.map((key) => (
                    <option key={key} value={key}>
                      {t(`donate.main.categories.${key}`)}
                    </option>
                  ))}
                </select>
              </label>
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

            <div className="mt-7 rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[0.94rem] leading-[1.6] text-[#4f6170]">
              <p className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined mt-0.5 text-[1.1rem] text-[#115b82]"
                >
                  receipt_long
                </span>
                <span>{t('donate.main.receipt.note')}</span>
              </p>
              <label className="mt-3 flex items-start gap-3 border-t border-[#edf3f7] pt-3">
                <input
                  checked={wantsSignedReceipt}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#13703e]"
                  onChange={(event) => setWantsSignedReceipt(event.target.checked)}
                  type="checkbox"
                />
                <span>{t('donate.main.receipt.signedOption')}</span>
              </label>
            </div>

            <label className="mt-4 flex items-start gap-3 rounded-[1rem] border border-[#d7e6ef] bg-white px-4 py-3.5 text-[0.94rem] leading-[1.6] text-[#4f6170]">
              <input
                checked={hasAgreedToPolicies}
                className="mt-1 h-4 w-4 shrink-0 accent-[#13703e]"
                onChange={(event) => setHasAgreedToPolicies(event.target.checked)}
                type="checkbox"
              />
              <span>
                <Trans
                  components={{
                    terms: (
                      <Link
                        className={policyLinkClass}
                        rel="noopener"
                        target="_blank"
                        to="/terms-and-conditions"
                      />
                    ),
                    privacy: (
                      <Link
                        className={policyLinkClass}
                        rel="noopener"
                        target="_blank"
                        to="/privacy-policy"
                      />
                    ),
                    refund: (
                      <Link
                        className={policyLinkClass}
                        rel="noopener"
                        target="_blank"
                        to="/refund-policy"
                      />
                    ),
                  }}
                  i18nKey="donate.main.agreement.text"
                />
              </span>
            </label>
            {!hasAgreedToPolicies ? (
              <p
                id="donate-agreement-note"
                className="mt-2 text-[0.84rem] leading-[1.6] text-[#5d6d78]"
              >
                {t('donate.main.agreement.required')}
              </p>
            ) : null}

            {errorKey ? (
              <p
                className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-[0.92rem] leading-[1.6] text-[#9e3342]"
                role="alert"
              >
                {t(`donate.main.errors.${errorKey}`, {
                  min: MIN_DONATION_BDT,
                  max: MAX_DONATION_BDT,
                })}
              </p>
            ) : null}

            <button
              aria-describedby={!hasAgreedToPolicies ? 'donate-agreement-note' : undefined}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#9cbfa9] disabled:shadow-none"
              disabled={!hasAgreedToPolicies || isSubmitting}
              type="submit"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
                lock
              </span>
              {isSubmitting
                ? t('donate.main.redirecting')
                : Number.isFinite(amount) && amount >= MIN_DONATION_BDT
                  ? t('donate.main.donateAmount', { amount: amount.toLocaleString('en-US') })
                  : t('common.actions.donateNow')}
            </button>
            <p className="mt-3 text-center text-[0.82rem] leading-[1.6] text-[#5d6d78]">
              {t('donate.main.secureNote')}
            </p>
          </form>
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
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]"
                    >
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
