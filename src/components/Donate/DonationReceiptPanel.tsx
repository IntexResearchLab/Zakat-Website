import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ReceiptDetails = {
  status: 'paid' | 'review'
  donorName: string
  amount: number
  category: string
  paidAt: string | null
  tranId: string
  receiptNumber: string | null
  receiptEmailed: boolean
  signedReceiptStatus: 'none' | 'requested' | 'sent'
}

type DonationReceiptPanelProps = {
  receiptRef: string
}

// Receipt details, PDF download, and the hand-signed receipt request. Shown on the
// thank-you page and on the page linked from the receipt email.
function DonationReceiptPanel({ receiptRef }: DonationReceiptPanelProps) {
  const { t } = useTranslation()
  const [details, setDetails] = useState<ReceiptDetails | null>(null)
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [isRequesting, setIsRequesting] = useState(false)
  const [requestError, setRequestError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        const response = await fetch(`/api/receipts/details?ref=${encodeURIComponent(receiptRef)}`)
        if (!response.ok) {
          throw new Error(String(response.status))
        }
        const data = (await response.json()) as ReceiptDetails
        if (isMounted) {
          setDetails(data)
          setLoadState('ready')
        }
      } catch {
        if (isMounted) {
          setLoadState('error')
        }
      }
    }

    void load()
    return () => {
      isMounted = false
    }
  }, [receiptRef])

  const requestSignedReceipt = async () => {
    setIsRequesting(true)
    setRequestError(false)

    try {
      const response = await fetch('/api/receipts/request-signed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: receiptRef }),
      })
      const data = (await response.json().catch(() => ({}))) as {
        signedReceiptStatus?: ReceiptDetails['signedReceiptStatus']
      }

      if (!response.ok || !data.signedReceiptStatus) {
        throw new Error(String(response.status))
      }

      setDetails((current) =>
        current ? { ...current, signedReceiptStatus: data.signedReceiptStatus ?? 'requested' } : current,
      )
    } catch {
      setRequestError(true)
    }

    setIsRequesting(false)
  }

  if (loadState === 'loading') {
    return (
      <p className="mt-7 rounded-[1rem] border border-dashed border-[#dbe7ee] px-5 py-6 text-[0.94rem] text-[#5d6d78]">
        {t('donate.receipt.loading')}
      </p>
    )
  }

  if (loadState === 'error' || !details) {
    return (
      <p className="mt-7 rounded-[1rem] border border-[#e4edf3] bg-[#f9fcfe] px-5 py-4 text-left text-[0.94rem] leading-[1.7] text-[#5d6d78]">
        {t('donate.receipt.loadError')}
      </p>
    )
  }

  const isPaid = details.status === 'paid'
  const paidDate = details.paidAt
    ? new Date(details.paidAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="mt-7 space-y-4 text-left">
      <dl className="space-y-2 rounded-[1rem] border border-[#e4edf3] bg-[#f9fcfe] px-5 py-4 text-[0.94rem]">
        {details.receiptNumber ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#5d6d78]">{t('donate.receipt.numberLabel')}</dt>
            <dd className="font-semibold text-[#14324d]">{details.receiptNumber}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#5d6d78]">{t('donate.result.amountLabel')}</dt>
          <dd className="font-semibold text-[#14324d]">৳{details.amount.toLocaleString('en-US')}</dd>
        </div>
        {paidDate ? (
          <div className="flex justify-between gap-4">
            <dt className="text-[#5d6d78]">{t('donate.receipt.dateLabel')}</dt>
            <dd className="font-semibold text-[#14324d]">{paidDate}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-[#5d6d78]">{t('donate.result.transactionLabel')}</dt>
          <dd className="break-all font-mono text-[0.86rem] text-[#14324d]">{details.tranId}</dd>
        </div>
      </dl>

      {isPaid ? (
        <div className="rounded-[1rem] border border-[#e4edf3] px-5 py-4">
          <p className="text-[0.94rem] leading-[1.7] text-[#4f6170]">
            {details.receiptEmailed ? t('donate.receipt.emailed') : t('donate.receipt.emailPending')}
          </p>
          <a
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e6ef] bg-white px-5 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:bg-[#f6fbff]"
            download
            href={`/api/receipts/pdf?ref=${encodeURIComponent(receiptRef)}`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.05rem]">download</span>
            {t('donate.receipt.downloadButton')}
          </a>
        </div>
      ) : null}

      <div className="rounded-[1rem] border border-[#e4edf3] px-5 py-4">
        <p className="font-semibold text-[#14324d]">{t('donate.receipt.signedTitle')}</p>
        {details.signedReceiptStatus === 'none' ? (
          <>
            <p className="mt-1 text-[0.94rem] leading-[1.7] text-[#4f6170]">{t('donate.receipt.signedDescription')}</p>
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#13703e] px-5 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isRequesting}
              onClick={() => void requestSignedReceipt()}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[1.05rem]">draw</span>
              {isRequesting ? t('donate.receipt.requesting') : t('donate.receipt.requestButton')}
            </button>
            {requestError ? (
              <p className="mt-2 text-[0.88rem] text-[#9e3342]" role="alert">
                {t('donate.receipt.requestError')}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-1 flex items-start gap-2 text-[0.94rem] leading-[1.7] text-[#13703e]" role="status">
            <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[1.05rem]">check_circle</span>
            {details.signedReceiptStatus === 'sent' ? t('donate.receipt.signedSent') : t('donate.receipt.signedRequested')}
          </p>
        )}
      </div>
    </div>
  )
}

export default DonationReceiptPanel
