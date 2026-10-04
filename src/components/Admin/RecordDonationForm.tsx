import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  callAdminApi,
  donationCategories,
  paymentMethods,
  type AdminDonation,
  type PaymentMethod,
} from '../../lib/adminDonations'

type RecordDonationFormProps = {
  onRecorded: (donation: AdminDonation, emailed: boolean) => void
  onCancel: () => void
}

const fieldClass =
  'w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-1.5 text-[0.86rem] font-semibold text-[#14324d]'

// Dates in Dhaka time, so "today" matches the date on the office calendar.
const todayInDhaka = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Records a donation received outside the website: bKash, Nagad, bank transfer or cash.
function RecordDonationForm({ onRecorded, onCancel }: RecordDonationFormProps) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    receivedOn: todayInDhaka(),
    method: 'bkash' as PaymentMethod,
    reference: '',
    category: 'default' as (typeof donationCategories)[number],
    notes: '',
  })
  const [sendReceipt, setSendReceipt] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const update = (field: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  const hasEmail = form.email.trim().length > 0

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    const amount = Number(form.amount.replace(/[^\d.]/g, ''))

    if (!form.name.trim()) {
      setErrorMessage(t('admin.donations.record.errors.name'))
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage(t('admin.donations.record.errors.amount'))
      return
    }
    if (hasEmail && !emailPattern.test(form.email.trim())) {
      setErrorMessage(t('admin.donations.record.errors.email'))
      return
    }
    if (!form.receivedOn || form.receivedOn > todayInDhaka()) {
      setErrorMessage(t('admin.donations.record.errors.date'))
      return
    }

    setIsSaving(true)
    const result = await callAdminApi('/api/admin/record-donation', {
      ...form,
      amount,
      sendReceipt: hasEmail && sendReceipt,
    })
    setIsSaving(false)

    if (!result.ok || !result.donation) {
      const errorKeys: Record<string, string> = {
        unauthorized: 'admin.errors.permission',
        network: 'admin.errors.network',
        invalid_amount: 'admin.donations.record.errors.amount',
        invalid_name: 'admin.donations.record.errors.name',
        invalid_email: 'admin.donations.record.errors.email',
        invalid_date: 'admin.donations.record.errors.date',
      }
      setErrorMessage(t(errorKeys[result.error ?? ''] ?? 'admin.errors.generic'))
      return
    }

    onRecorded(result.donation, Boolean(result.emailed))
  }

  return (
    <form
      className="mt-8 rounded-[1.35rem] border border-[#9fc7da] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
    >
      <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
        {t('admin.donations.record.title')}
      </h2>
      <p className="mt-3 text-[0.94rem] leading-[1.7] text-[#5d6d78]">
        {t('admin.donations.record.intro')}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {t('admin.donations.record.name')}
          <input
            className={fieldClass}
            id="record-name"
            onChange={(event) => update('name')(event.target.value)}
            required
            value={form.name}
          />
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.amount')}
          <input
            className={fieldClass}
            id="record-amount"
            inputMode="decimal"
            onChange={(event) => update('amount')(event.target.value)}
            placeholder="৳"
            required
            value={form.amount}
          />
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.method')}
          <select
            className={fieldClass}
            id="record-method"
            onChange={(event) => update('method')(event.target.value)}
            value={form.method}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {t(`admin.donations.methods.${method}`)}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.receivedOn')}
          <input
            className={fieldClass}
            id="record-date"
            max={todayInDhaka()}
            onChange={(event) => update('receivedOn')(event.target.value)}
            required
            type="date"
            value={form.receivedOn}
          />
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.reference')}
          <input
            className={fieldClass}
            id="record-reference"
            onChange={(event) => update('reference')(event.target.value)}
            placeholder={t('admin.donations.record.referencePlaceholder')}
            value={form.reference}
          />
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.category')}
          <select
            className={fieldClass}
            id="record-category"
            onChange={(event) => update('category')(event.target.value)}
            value={form.category}
          >
            {donationCategories.map((category) => (
              <option key={category} value={category}>
                {t(`donate.main.categories.${category}`)}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.email')}
          <input
            autoComplete="off"
            className={fieldClass}
            id="record-email"
            onChange={(event) => update('email')(event.target.value)}
            type="email"
            value={form.email}
          />
        </label>
        <label className={labelClass}>
          {t('admin.donations.record.phone')}
          <input
            autoComplete="off"
            className={fieldClass}
            id="record-phone"
            onChange={(event) => update('phone')(event.target.value)}
            type="tel"
            value={form.phone}
          />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          {t('admin.donations.record.notes')}
          <textarea
            className={`${fieldClass} min-h-[5rem]`}
            id="record-notes"
            onChange={(event) => update('notes')(event.target.value)}
            value={form.notes}
          />
        </label>
      </div>

      <label className="mt-5 flex items-start gap-3 text-[0.92rem] leading-[1.6] text-[#4f6170]">
        <input
          checked={hasEmail && sendReceipt}
          className="mt-1 h-4 w-4 shrink-0 accent-[#13703e]"
          disabled={!hasEmail}
          id="record-send-receipt"
          onChange={(event) => setSendReceipt(event.target.checked)}
          type="checkbox"
        />
        <span>
          {hasEmail
            ? t('admin.donations.record.sendReceipt')
            : t('admin.donations.record.noEmailNote')}
        </span>
      </label>

      {errorMessage ? (
        <p
          className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]"
          role="alert"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-[#13703e] px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? t('admin.donations.record.saving') : t('admin.donations.record.save')}
        </button>
        <button
          className="rounded-full border border-[#dbe7ee] bg-white px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:bg-[#f7fbfd]"
          disabled={isSaving}
          onClick={onCancel}
          type="button"
        >
          {t('admin.donations.record.cancel')}
        </button>
      </div>
    </form>
  )
}

export default RecordDonationForm
