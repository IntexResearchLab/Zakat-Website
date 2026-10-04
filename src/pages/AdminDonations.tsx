import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getFriendlyErrorMessage } from '../lib/adminErrors'
import { callAdminApi, type AdminDonation } from '../lib/adminDonations'
import RecordDonationForm from '../components/Admin/RecordDonationForm'
import { loadCampaigns } from '../lib/campaigns'
import { supabase } from '../utils/supabase'

type Donation = AdminDonation

type DonationFilter =
  'confirmed' | 'manual' | 'signedRequested' | 'review' | 'emailFailed' | 'unpaid' | 'all'

const filterKeys: DonationFilter[] = [
  'confirmed',
  'manual',
  'signedRequested',
  'review',
  'emailFailed',
  'unpaid',
  'all',
]
const signedReceiptBucket = 'signed-receipts'
const maxSignedReceiptBytes = 10 * 1024 * 1024
const signedReceiptTypes = ['application/pdf', 'image/jpeg', 'image/png']

const isConfirmed = (donation: Donation) =>
  donation.status === 'paid' || donation.status === 'review'

const matchesFilter = (donation: Donation, filter: DonationFilter) => {
  switch (filter) {
    case 'confirmed':
      return isConfirmed(donation)
    case 'manual':
      return donation.source === 'manual'
    case 'signedRequested':
      return isConfirmed(donation) && donation.signed_receipt_status === 'requested'
    case 'review':
      return donation.status === 'review'
    case 'emailFailed':
      // Only donations with an email address can be emailed a receipt.
      return (
        donation.status === 'paid' && Boolean(donation.donor_email) && !donation.receipt_sent_at
      )
    case 'unpaid':
      return !isConfirmed(donation)
    default:
      return true
  }
}

const formatTaka = (value: number) =>
  `৳${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const formatDate = (value: string | null) =>
  value
    ? new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

// Manual entries only have a date; their stored time (noon in Dhaka) means nothing.
const formatDay = (value: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Dhaka',
      })
    : '-'

const donationAmount = (donation: Donation) => Number(donation.paid_amount ?? donation.amount)

const csvCell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`

const badgeClass = {
  green: 'border-[#cde7d8] bg-[#f5fbf7] text-[#13703e]',
  amber: 'border-[#f1dfb8] bg-[#fffaf0] text-[#8a5a00]',
  red: 'border-[#f3d1d4] bg-[#fff6f7] text-[#9e3342]',
  grey: 'border-[#dbe7ee] bg-[#f6f9fb] text-[#4f6473]',
}

function AdminDonations() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<DonationFilter>('confirmed')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [campaignTitles, setCampaignTitles] = useState<Map<string, string>>(new Map())
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const describeMethod = (donation: Donation) =>
    donation.source === 'manual'
      ? t(`admin.donations.methods.${donation.payment_method ?? 'other'}`)
      : (donation.card_type ?? t('admin.donations.methods.online'))

  const loadDonations = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      setDonations((data ?? []) as Donation[])
    }

    setIsLoading(false)
  }

  useEffect(() => {
    // Campaign names for the rows and the "record a donation" form. Optional, so failures are ignored.
    loadCampaigns()
      .then((campaigns) =>
        setCampaignTitles(new Map(campaigns.map((campaign) => [campaign.id, campaign.title_en]))),
      )
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    void loadDonations()
    // Load once on open; the Refresh button reloads on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmed = useMemo(() => donations.filter(isConfirmed), [donations])
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthTotal = confirmed
    .filter((donation) => new Date(donation.paid_at ?? donation.created_at) >= monthStart)
    .reduce((sum, donation) => sum + donationAmount(donation), 0)
  const allTimeTotal = confirmed.reduce((sum, donation) => sum + donationAmount(donation), 0)
  const filterCounts = Object.fromEntries(
    filterKeys.map((key) => [
      key,
      donations.filter((donation) => matchesFilter(donation, key)).length,
    ]),
  ) as Record<DonationFilter, number>

  const visibleDonations = useMemo(() => {
    const query = search.trim().toLowerCase()

    return donations.filter(
      (donation) =>
        matchesFilter(donation, filter) &&
        (!query ||
          [
            donation.donor_name,
            donation.donor_email,
            donation.donor_phone,
            donation.receipt_number,
            donation.tran_id,
            donation.reference,
          ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))),
    )
  }, [donations, filter, search])

  const replaceDonation = (updated: Donation) =>
    setDonations((current) =>
      current.map((donation) => (donation.id === updated.id ? updated : donation)),
    )

  const showResult = (ok: boolean, successKey: string, error?: string) => {
    setSuccessMessage(ok ? t(successKey) : '')
    setErrorMessage(
      ok
        ? ''
        : error === 'unauthorized'
          ? t('admin.errors.permission')
          : error === 'email_failed'
            ? t('admin.donations.errors.emailFailed')
            : error === 'network'
              ? t('admin.errors.network')
              : t('admin.errors.generic'),
    )
  }

  const handleRecorded = (donation: Donation, emailed: boolean) => {
    setDonations((current) => [donation, ...current])
    setIsRecording(false)
    setFilter('confirmed')
    setErrorMessage('')
    setSuccessMessage(
      t(emailed ? 'admin.donations.record.savedAndEmailed' : 'admin.donations.record.saved', {
        number: donation.receipt_number ?? '',
      }),
    )
  }

  const handleDelete = async (donation: Donation) => {
    setBusyId(donation.id)
    const result = await callAdminApi('/api/admin/delete-donation', { id: donation.id })

    if (result.ok) {
      setDonations((current) => current.filter((item) => item.id !== donation.id))
    }
    setConfirmDeleteId(null)
    showResult(result.ok, 'admin.donations.deleted', result.error)
    setBusyId(null)
  }

  const handleResendReceipt = async (donation: Donation) => {
    if (donation.status === 'review' && !window.confirm(t('admin.donations.approveConfirm'))) {
      return
    }

    setBusyId(donation.id)
    const result = await callAdminApi('/api/admin/resend-receipt', { id: donation.id })

    if (result.donation) {
      replaceDonation(result.donation)
    }
    showResult(result.ok, 'admin.donations.receiptSent', result.error)
    setBusyId(null)
  }

  const handleSignedUpload = async (donation: Donation, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return
    }

    if (!signedReceiptTypes.includes(file.type)) {
      setErrorMessage(t('admin.donations.errors.fileType'))
      return
    }

    if (file.size > maxSignedReceiptBytes) {
      setErrorMessage(t('admin.errors.fileTooLarge'))
      return
    }

    if (!window.confirm(t('admin.donations.sendSignedConfirm', { email: donation.donor_email }))) {
      return
    }

    setBusyId(donation.id)
    setSuccessMessage('')
    setErrorMessage('')

    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const path = `${donation.id}/${Date.now()}-signed-receipt.${extension}`
    const { error: uploadError } = await supabase.storage
      .from(signedReceiptBucket)
      .upload(path, file, { contentType: file.type })

    if (uploadError) {
      setErrorMessage(getFriendlyErrorMessage(t, uploadError))
      setBusyId(null)
      return
    }

    const result = await callAdminApi('/api/admin/send-signed-receipt', { id: donation.id, path })

    if (result.donation) {
      replaceDonation(result.donation)
    }
    showResult(result.ok, 'admin.donations.signedSent', result.error)
    setBusyId(null)
  }

  const handleViewSigned = async (donation: Donation) => {
    if (!donation.signed_receipt_path) {
      return
    }

    const { data, error } = await supabase.storage
      .from(signedReceiptBucket)
      .createSignedUrl(donation.signed_receipt_path, 60)

    if (error || !data) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
      return
    }

    window.open(data.signedUrl, '_blank', 'noopener')
  }

  const handleExport = () => {
    const header = [
      'Receipt number',
      'Status',
      'Date',
      'Donor name',
      'Email',
      'Phone',
      'Amount (BDT)',
      'Purpose',
      'Campaign',
      'Source',
      'Payment method',
      'Reference',
      'Notes',
      'Recorded by',
      'Transaction or record ID',
      'Receipt emailed',
      'Signed receipt',
    ]
    const rows = visibleDonations.map((donation) => [
      donation.receipt_number,
      donation.status,
      donation.paid_at ?? donation.created_at,
      donation.donor_name,
      donation.donor_email,
      donation.donor_phone,
      donationAmount(donation),
      t(`donate.main.categories.${donation.category}`, { defaultValue: donation.category }),
      donation.campaign_id ? (campaignTitles.get(donation.campaign_id) ?? '') : '',
      donation.source,
      describeMethod(donation),
      donation.reference,
      donation.notes,
      donation.recorded_by,
      donation.tran_id,
      donation.receipt_sent_at ? 'yes' : 'no',
      donation.signed_receipt_status,
    ])
    // The byte-order mark lets Excel open the file as UTF-8, so Bangla names display correctly.
    const csv = '﻿' + [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `alokayon-donations-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const statusBadge = (donation: Donation) => {
    const tone =
      donation.status === 'paid'
        ? 'green'
        : donation.status === 'review'
          ? 'amber'
          : donation.status === 'pending'
            ? 'grey'
            : 'red'
    return (
      <span
        className={`rounded-full border px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] ${badgeClass[tone]}`}
      >
        {t(`admin.donations.status.${donation.status}`)}
      </span>
    )
  }

  return (
    <AdminShellLayout
      description={t('admin.donations.description')}
      eyebrow={t('admin.donations.eyebrow')}
      headerActions={
        <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            {t('admin.donations.monthLabel')}
          </p>
          <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {formatTaka(monthTotal)}
          </p>
          <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#627581]">
            {t('admin.donations.allTime', {
              amount: formatTaka(allTimeTotal),
              count: confirmed.length,
            })}
          </p>
        </div>
      }
      title={t('admin.donations.title')}
    >
      {isRecording ? (
        <RecordDonationForm
          campaigns={[...campaignTitles].map(([id, title]) => ({ id, title }))}
          onCancel={() => setIsRecording(false)}
          onRecorded={handleRecorded}
        />
      ) : (
        <button
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#13703e] px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
          onClick={() => {
            setSuccessMessage('')
            setIsRecording(true)
          }}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
            add
          </span>
          {t('admin.donations.record.open')}
        </button>
      )}

      {filterCounts.signedRequested ? (
        <button
          className="mt-8 flex w-full items-center gap-3 rounded-[1.1rem] border border-[#f1dfb8] bg-[#fffaf0] px-5 py-4 text-left text-[0.96rem] text-[#6b4a00] transition hover:bg-[#fff5e0]"
          onClick={() => setFilter('signedRequested')}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[1.3rem]">
            draw
          </span>
          {t('admin.donations.signedAlert', { count: filterCounts.signedRequested })}
        </button>
      ) : null}

      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-3 border-b border-[#edf3f7] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
              {t('admin.donations.listTitle')}
            </h2>
            <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
              {t('admin.donations.listIntro')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd] disabled:opacity-60"
              disabled={!visibleDonations.length}
              onClick={handleExport}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                download
              </span>
              {t('admin.donations.export')}
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
              onClick={() => void loadDonations()}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                refresh
              </span>
              {t('admin.stats.refresh')}
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="relative block">
            <span className="sr-only">{t('admin.donations.searchPlaceholder')}</span>
            <span
              aria-hidden="true"
              className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-[#5d6d78]"
            >
              search
            </span>
            <input
              className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 pl-10 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.donations.searchPlaceholder')}
              type="search"
              value={search}
            />
          </label>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t('admin.donations.filterLabel')}
          >
            {filterKeys.map((key) => (
              <button
                aria-pressed={filter === key}
                className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition ${
                  filter === key
                    ? 'border-[#115b82] bg-[#115b82] text-white'
                    : 'border-[#dbe7ee] bg-white text-[#4f6473] hover:border-[#bfd5e4]'
                }`}
                key={key}
                onClick={() => setFilter(key)}
                type="button"
              >
                {t(`admin.donations.filters.${key}`)} ({filterCounts[key]})
              </button>
            ))}
          </div>
        </div>

        {errorMessage ? (
          <p
            className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p
            className="mt-5 rounded-[1rem] border border-[#cde7d8] bg-[#f5fbf7] px-4 py-3 text-sm leading-[1.7] text-[#13703e]"
            role="status"
          >
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#627581]">
            {t('admin.donations.loading')}
          </div>
        ) : !visibleDonations.length ? (
          <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#627581]">
            {t('admin.donations.empty')}
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {visibleDonations.map((donation) => {
              const isBusy = busyId === donation.id
              const canEmail = isConfirmed(donation)

              return (
                <li
                  className="rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5"
                  key={donation.id}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                          {donation.donor_name}
                        </p>
                        {statusBadge(donation)}
                      </div>
                      {donation.donor_email || donation.donor_phone ? (
                        <p className="mt-1 break-all text-[0.9rem] text-[#627581]">
                          {[donation.donor_email, donation.donor_phone].filter(Boolean).join(' · ')}
                        </p>
                      ) : null}
                      <p className="mt-2 text-[0.86rem] text-[#627581]">
                        {donation.source === 'manual'
                          ? formatDay(donation.paid_at)
                          : formatDate(donation.paid_at ?? donation.created_at)}{' '}
                        ·{' '}
                        {t(`donate.main.categories.${donation.category}`, {
                          defaultValue: donation.category,
                        })}
                        {' · '}
                        {describeMethod(donation)}
                        {donation.reference ? ` (${donation.reference})` : ''}
                      </p>
                      {donation.campaign_id && campaignTitles.get(donation.campaign_id) ? (
                        <p className="mt-1 text-[0.84rem] font-semibold text-[#13703e]">
                          {t('admin.donations.campaignLabel', {
                            title: campaignTitles.get(donation.campaign_id),
                          })}
                        </p>
                      ) : null}
                      {donation.source === 'manual' ? (
                        <p className="mt-1 text-[0.84rem] text-[#5d6d78]">
                          {t('admin.donations.recordedBy', { name: donation.recorded_by ?? '-' })}
                          {donation.notes ? ` · ${donation.notes}` : ''}
                        </p>
                      ) : null}
                      <p className="mt-1 font-mono text-[0.8rem] text-[#627581]">
                        {donation.receipt_number ? `${donation.receipt_number} · ` : ''}
                        {donation.tran_id}
                      </p>
                    </div>
                    <p className="shrink-0 font-serif text-[1.8rem] leading-none tracking-[-0.04em] text-[#13703e]">
                      {formatTaka(donationAmount(donation))}
                    </p>
                  </div>

                  {canEmail ? (
                    <div className="mt-4 grid gap-3 border-t border-[#edf3f7] pt-4 md:grid-cols-2">
                      <div className="text-[0.88rem] leading-[1.6]">
                        <p className="font-semibold text-[#14324d]">
                          {t('admin.donations.digitalReceipt')}
                        </p>
                        <p
                          className={
                            donation.status === 'review'
                              ? 'text-[#8a5a00]'
                              : !donation.donor_email
                                ? 'text-[#5d6d78]'
                                : donation.receipt_sent_at
                                  ? 'text-[#13703e]'
                                  : 'text-[#9e3342]'
                          }
                        >
                          {donation.status === 'review'
                            ? t('admin.donations.reviewNote')
                            : !donation.donor_email
                              ? t('admin.donations.noEmail')
                              : donation.receipt_sent_at
                                ? t('admin.donations.emailedOn', {
                                    date: formatDate(donation.receipt_sent_at),
                                  })
                                : t('admin.donations.notEmailed')}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {donation.status === 'paid' ? (
                            <a
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-3.5 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                              download
                              href={`/api/receipts/pdf?ref=${donation.receipt_token}`}
                            >
                              <span
                                aria-hidden="true"
                                className="material-symbols-outlined text-[0.95rem]"
                              >
                                picture_as_pdf
                              </span>
                              {t('admin.donations.downloadPdf')}
                            </a>
                          ) : null}
                          {donation.donor_email ? (
                            <button
                              className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-3.5 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
                              disabled={isBusy}
                              onClick={() => void handleResendReceipt(donation)}
                              type="button"
                            >
                              <span
                                aria-hidden="true"
                                className="material-symbols-outlined text-[0.95rem]"
                              >
                                send
                              </span>
                              {donation.status === 'review'
                                ? t('admin.donations.approveAndSend')
                                : donation.receipt_sent_at
                                  ? t('admin.donations.resend')
                                  : t('admin.donations.send')}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-[0.88rem] leading-[1.6]">
                        <p className="font-semibold text-[#14324d]">
                          {t('admin.donations.signedReceipt')}
                        </p>
                        {donation.signed_receipt_status === 'none' ? (
                          <p className="text-[#627581]">{t('admin.donations.signedNone')}</p>
                        ) : donation.signed_receipt_status === 'requested' ? (
                          <>
                            <p className="text-[#8a5a00]">
                              {t('admin.donations.signedRequestedOn', {
                                date: formatDate(donation.signed_receipt_requested_at),
                              })}
                            </p>
                            <p className="text-[#627581]">{t('admin.donations.signedSteps')}</p>
                          </>
                        ) : (
                          <p className="text-[#13703e]">
                            {t('admin.donations.signedSentOn', {
                              date: formatDate(donation.signed_receipt_sent_at),
                            })}
                          </p>
                        )}
                        {/* A signed copy needs the receipt number, which is assigned once the payment is approved. */}
                        {donation.status === 'paid' && donation.donor_email ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <label
                              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] transition ${
                                donation.signed_receipt_status === 'requested'
                                  ? 'bg-[#13703e] text-white hover:bg-[#105f35]'
                                  : 'border border-[#dbe7ee] bg-white text-[#115b82] hover:bg-[#f7fbfd]'
                              } ${isBusy ? 'pointer-events-none opacity-60' : ''}`}
                            >
                              <span
                                aria-hidden="true"
                                className="material-symbols-outlined text-[0.95rem]"
                              >
                                upload_file
                              </span>
                              {isBusy
                                ? t('admin.donations.working')
                                : donation.signed_receipt_status === 'sent'
                                  ? t('admin.donations.uploadAgain')
                                  : t('admin.donations.uploadSigned')}
                              <input
                                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                className="sr-only"
                                disabled={isBusy}
                                onChange={(event) => void handleSignedUpload(donation, event)}
                                type="file"
                              />
                            </label>
                            {donation.signed_receipt_path ? (
                              <button
                                className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-3.5 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                                onClick={() => void handleViewSigned(donation)}
                                type="button"
                              >
                                <span
                                  aria-hidden="true"
                                  className="material-symbols-outlined text-[0.95rem]"
                                >
                                  visibility
                                </span>
                                {t('admin.donations.viewSigned')}
                              </button>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {donation.source === 'manual' ? (
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#edf3f7] pt-4 text-[0.86rem]">
                      {confirmDeleteId === donation.id ? (
                        <>
                          <span className="text-[#9e3342]">
                            {t('admin.donations.deleteConfirm')}
                          </span>
                          <button
                            className="rounded-full bg-[#a33b49] px-4 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#8c2f3c] disabled:opacity-60"
                            disabled={isBusy}
                            onClick={() => void handleDelete(donation)}
                            type="button"
                          >
                            {t('admin.donations.deleteYes')}
                          </button>
                          <button
                            className="rounded-full border border-[#dbe7ee] bg-white px-4 py-1.5 text-[0.76rem] font-bold uppercase tracking-[0.12em] text-[#14324d] transition hover:bg-[#f7fbfd]"
                            onClick={() => setConfirmDeleteId(null)}
                            type="button"
                          >
                            {t('admin.donations.deleteNo')}
                          </button>
                        </>
                      ) : (
                        <button
                          className="font-semibold text-[#9e3342] underline-offset-2 hover:underline"
                          onClick={() => setConfirmDeleteId(donation.id)}
                          type="button"
                        >
                          {t('admin.donations.delete')}
                        </button>
                      )}
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </AdminShellLayout>
  )
}

export default AdminDonations
