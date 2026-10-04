import { useId, useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Breadcrumb from '../components/reusables/Breadcrumb'
import { usePublicStats } from '../lib/publicStats'
import {
  GOLD_NISAB_GRAMS,
  GRAMS_PER_VORI,
  SILVER_NISAB_GRAMS,
  calculateZakat,
  parseAmount,
  type NisabBasis,
  type WeightUnit,
} from '../lib/zakat'

type AmountField =
  | 'cash'
  | 'investments'
  | 'businessStock'
  | 'receivables'
  | 'otherAssets'
  | 'debtsDue'
  | 'goldWeight'
  | 'silverWeight'

const fieldClass =
  'w-full rounded-[0.9rem] border border-[#d7e6ef] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'

type NumberFieldProps = {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  prefix?: string
  suffix?: ReactNode
}

function NumberField({ label, hint, value, onChange, prefix = '৳', suffix }: NumberFieldProps) {
  const id = useId()
  const hintId = `${id}-hint`

  return (
    <div className="grid gap-1.5">
      <label className="text-[0.92rem] font-semibold text-[#14324d]" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className="text-[0.84rem] leading-[1.55] text-[#5d6d78]" id={hintId}>
          {hint}
        </p>
      ) : null}
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          {prefix ? (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-[#5d6d78]"
            >
              {prefix}
            </span>
          ) : null}
          <input
            aria-describedby={hint ? hintId : undefined}
            className={`${fieldClass} ${prefix ? 'pl-9' : ''}`}
            id={id}
            inputMode="decimal"
            onChange={(event) => onChange(event.target.value.replace(/[^\d.,০-৯]/g, ''))}
            placeholder="0"
            type="text"
            value={value}
          />
        </div>
        {suffix}
      </div>
    </div>
  )
}

function ZakatCalculator() {
  const { t, i18n } = useTranslation()
  const { stats } = usePublicStats()
  const numberLocale = i18n.language === 'bn' ? 'bn-BD' : 'en-IN'
  const formatTaka = (value: number) =>
    `৳${value.toLocaleString(numberLocale, { maximumFractionDigits: 0 })}`

  const [amounts, setAmounts] = useState<Record<AmountField, string>>({
    cash: '',
    investments: '',
    businessStock: '',
    receivables: '',
    otherAssets: '',
    debtsDue: '',
    goldWeight: '',
    silverWeight: '',
  })
  const [goldUnit, setGoldUnit] = useState<WeightUnit>('vori')
  const [silverUnit, setSilverUnit] = useState<WeightUnit>('vori')
  const [nisabBasis, setNisabBasis] = useState<NisabBasis>('silver')
  // Prices start from the figures Alokayon publishes in the admin; visitors can change them.
  const [goldPriceInput, setGoldPriceInput] = useState<string | null>(null)
  const [silverPriceInput, setSilverPriceInput] = useState<string | null>(null)
  const goldPriceText = goldPriceInput ?? stats.goldPricePerGram ?? ''
  const silverPriceText = silverPriceInput ?? stats.silverPricePerGram ?? ''
  const pricesUpdated = stats.metalPricesUpdated

  const setAmount = (field: AmountField) => (value: string) =>
    setAmounts((current) => ({ ...current, [field]: value }))

  const result = useMemo(
    () =>
      calculateZakat({
        cash: parseAmount(amounts.cash),
        goldWeight: parseAmount(amounts.goldWeight),
        goldUnit,
        goldPricePerGram: parseAmount(goldPriceText),
        silverWeight: parseAmount(amounts.silverWeight),
        silverUnit,
        silverPricePerGram: parseAmount(silverPriceText),
        investments: parseAmount(amounts.investments),
        businessStock: parseAmount(amounts.businessStock),
        receivables: parseAmount(amounts.receivables),
        otherAssets: parseAmount(amounts.otherAssets),
        debtsDue: parseAmount(amounts.debtsDue),
        nisabBasis,
      }),
    [amounts, goldUnit, silverUnit, goldPriceText, silverPriceText, nisabBasis],
  )

  const hasEnteredWealth = result.totalAssets > 0
  const nisabGrams = nisabBasis === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS

  const unitSelect = (value: WeightUnit, onChange: (unit: WeightUnit) => void, label: string) => (
    <select
      aria-label={label}
      className="w-[7.5rem] shrink-0 rounded-[0.9rem] border border-[#d7e6ef] bg-white px-3 py-3 text-[0.95rem] text-[#14324d] outline-none focus:border-[#115b82]"
      onChange={(event) => onChange(event.target.value as WeightUnit)}
      value={value}
    >
      <option value="vori">{t('zakatCalculator.units.vori')}</option>
      <option value="gram">{t('zakatCalculator.units.gram')}</option>
    </select>
  )

  const summaryRows: Array<{ label: string; value: number; isDeduction?: boolean }> = [
    { label: t('zakatCalculator.summary.totalAssets'), value: result.totalAssets },
    { label: t('zakatCalculator.summary.deductions'), value: result.deductions, isDeduction: true },
    { label: t('zakatCalculator.summary.netWealth'), value: result.netWealth },
  ]

  const explainer = t('zakatCalculator.explainer.items', { returnObjects: true }) as Array<{
    title: string
    text: string
  }>

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:py-18">
          <Breadcrumb items={[{ label: t('common.breadcrumb.zakatCalculator') }]} />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('zakatCalculator.eyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] text-[#101d2b] sm:text-[3.4rem]">
            {t('zakatCalculator.title')}
          </h1>
          <p className="mt-6 max-w-3xl text-[1.04rem] leading-[1.85] text-[#5d6d78]">
            {t('zakatCalculator.intro')}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1fr_22rem] lg:items-start">
        <form className="grid min-w-0 gap-10" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="grid gap-5">
            <legend className="mb-4 font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-[#14324d]">
              {t('zakatCalculator.sections.nisab')}
            </legend>
            <div
              className="grid gap-3"
              role="radiogroup"
              aria-label={t('zakatCalculator.nisab.label')}
            >
              {(['silver', 'gold'] as const).map((basis) => (
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-[1rem] border px-4 py-3.5 transition ${
                    nisabBasis === basis
                      ? 'border-[#115b82] bg-[#eef7fc]'
                      : 'border-[#d7e6ef] bg-white hover:border-[#115b82]'
                  }`}
                  key={basis}
                >
                  <input
                    checked={nisabBasis === basis}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#115b82]"
                    name="nisab-basis"
                    onChange={() => setNisabBasis(basis)}
                    type="radio"
                    value={basis}
                  />
                  <span className="grid gap-0.5">
                    <span className="font-semibold text-[#14324d]">
                      {t(`zakatCalculator.nisab.${basis}.title`)}
                    </span>
                    <span className="text-[0.88rem] leading-[1.55] text-[#5d6d78]">
                      {t(`zakatCalculator.nisab.${basis}.description`)}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label={t('zakatCalculator.fields.goldPrice')}
                onChange={setGoldPriceInput}
                value={goldPriceText}
              />
              <NumberField
                label={t('zakatCalculator.fields.silverPrice')}
                onChange={setSilverPriceInput}
                value={silverPriceText}
              />
            </div>
            <p className="text-[0.88rem] leading-[1.6] text-[#5d6d78]">
              {pricesUpdated
                ? t('zakatCalculator.prices.updated', { date: pricesUpdated })
                : t('zakatCalculator.prices.missing')}{' '}
              <a
                className="font-semibold text-[#115b82] underline underline-offset-2"
                href="https://www.bajus.org/"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('zakatCalculator.prices.bajusLink')}
              </a>
            </p>
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="mb-4 font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-[#14324d]">
              {t('zakatCalculator.sections.assets')}
            </legend>
            <NumberField
              hint={t('zakatCalculator.hints.cash')}
              label={t('zakatCalculator.fields.cash')}
              onChange={setAmount('cash')}
              value={amounts.cash}
            />
            <NumberField
              hint={t('zakatCalculator.hints.gold', { grams: GRAMS_PER_VORI })}
              label={t('zakatCalculator.fields.gold')}
              onChange={setAmount('goldWeight')}
              prefix=""
              suffix={unitSelect(goldUnit, setGoldUnit, t('zakatCalculator.units.label'))}
              value={amounts.goldWeight}
            />
            <NumberField
              hint={t('zakatCalculator.hints.silver')}
              label={t('zakatCalculator.fields.silver')}
              onChange={setAmount('silverWeight')}
              prefix=""
              suffix={unitSelect(silverUnit, setSilverUnit, t('zakatCalculator.units.label'))}
              value={amounts.silverWeight}
            />
            <NumberField
              hint={t('zakatCalculator.hints.investments')}
              label={t('zakatCalculator.fields.investments')}
              onChange={setAmount('investments')}
              value={amounts.investments}
            />
            <NumberField
              hint={t('zakatCalculator.hints.businessStock')}
              label={t('zakatCalculator.fields.businessStock')}
              onChange={setAmount('businessStock')}
              value={amounts.businessStock}
            />
            <NumberField
              hint={t('zakatCalculator.hints.receivables')}
              label={t('zakatCalculator.fields.receivables')}
              onChange={setAmount('receivables')}
              value={amounts.receivables}
            />
            <NumberField
              hint={t('zakatCalculator.hints.otherAssets')}
              label={t('zakatCalculator.fields.otherAssets')}
              onChange={setAmount('otherAssets')}
              value={amounts.otherAssets}
            />
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="mb-4 font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-[#14324d]">
              {t('zakatCalculator.sections.deductions')}
            </legend>
            <NumberField
              hint={t('zakatCalculator.hints.debtsDue')}
              label={t('zakatCalculator.fields.debtsDue')}
              onChange={setAmount('debtsDue')}
              value={amounts.debtsDue}
            />
          </fieldset>
        </form>

        <aside
          aria-labelledby="zakat-summary-title"
          className="rounded-[1.4rem] border border-[#dbe7ee] bg-[#fbfdfe] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:sticky lg:top-28"
        >
          <h2
            className="font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#14324d]"
            id="zakat-summary-title"
          >
            {t('zakatCalculator.summary.title')}
          </h2>

          <dl className="mt-5 grid gap-2.5 border-b border-[#e4edf3] pb-5 text-[0.95rem]">
            {summaryRows.map(({ label, value, isDeduction }) => (
              <div className="flex justify-between gap-4" key={label}>
                <dt className="text-[#5d6d78]">{label}</dt>
                <dd className="font-semibold tabular-nums text-[#14324d]">
                  {isDeduction && value > 0 ? `− ${formatTaka(value)}` : formatTaka(value)}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-[#5d6d78]">
                {t('zakatCalculator.summary.nisab', {
                  grams: nisabGrams.toLocaleString(numberLocale),
                  metal: t(`zakatCalculator.nisab.${nisabBasis}.metal`),
                })}
              </dt>
              <dd className="font-semibold tabular-nums text-[#14324d]">
                {result.nisabThreshold === null ? '—' : formatTaka(result.nisabThreshold)}
              </dd>
            </div>
          </dl>

          <div aria-live="polite" className="mt-5">
            {result.nisabThreshold === null ? (
              <p className="text-[0.95rem] leading-[1.6] text-[#8a5a00]">
                {t('zakatCalculator.result.needPrice', {
                  metal: t(`zakatCalculator.nisab.${nisabBasis}.metal`),
                })}
              </p>
            ) : !hasEnteredWealth ? (
              <p className="text-[0.95rem] leading-[1.6] text-[#5d6d78]">
                {t('zakatCalculator.result.empty')}
              </p>
            ) : result.isAboveNisab ? (
              <>
                <p className="text-[0.9rem] font-semibold uppercase tracking-[0.14em] text-[#13703e]">
                  {t('zakatCalculator.result.dueLabel')}
                </p>
                <p className="mt-2 font-serif text-[2.6rem] leading-none tracking-[-0.04em] text-[#13703e] tabular-nums">
                  {formatTaka(result.zakatDue)}
                </p>
                <p className="mt-3 text-[0.9rem] leading-[1.6] text-[#5d6d78]">
                  {t('zakatCalculator.result.dueNote')}
                </p>
                {result.zakatDue <= 500000 ? (
                  <Link
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
                    to={`/donate?amount=${result.zakatDue}&category=zakat#donate-form`}
                  >
                    {t('zakatCalculator.result.payButton', { amount: formatTaka(result.zakatDue) })}
                  </Link>
                ) : (
                  <p className="mt-4 text-[0.9rem] leading-[1.6] text-[#4f6170]">
                    {t('zakatCalculator.result.largeAmount')}
                  </p>
                )}
              </>
            ) : (
              <p className="text-[0.95rem] leading-[1.6] text-[#4f6170]">
                {t('zakatCalculator.result.belowNisab')}
              </p>
            )}
          </div>
        </aside>
      </div>

      <section className="border-t border-[#e4edf3] bg-[#f7fbfd]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-serif text-[1.9rem] leading-tight tracking-[-0.03em] text-[#14324d]">
            {t('zakatCalculator.explainer.title')}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {explainer.map((item) => (
              <div key={item.title}>
                <h3 className="text-[1.05rem] font-semibold text-[#14324d]">{item.title}</h3>
                <p className="mt-2 text-[0.96rem] leading-[1.75] text-[#4f6170]">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl rounded-[1rem] border border-[#f1dfb8] bg-[#fffaf0] px-5 py-4 text-[0.92rem] leading-[1.7] text-[#6b4a00]">
            {t('zakatCalculator.disclaimer')}
          </p>
        </div>
      </section>
    </div>
  )
}

export default ZakatCalculator
