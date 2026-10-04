import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import DonationReceiptPanel from '../components/Donate/DonationReceiptPanel'

type DonationStatus = 'success' | 'failed' | 'cancelled' | 'receipt'

const statusStyles: Record<DonationStatus, { icon: string; iconClass: string }> = {
  success: { icon: 'check_circle', iconClass: 'bg-[#e8f5ee] text-[#13703e]' },
  failed: { icon: 'error', iconClass: 'bg-[#fdecee] text-[#a33b49]' },
  cancelled: { icon: 'info', iconClass: 'bg-[#eef3f7] text-[#4f6473]' },
  receipt: { icon: 'receipt_long', iconClass: 'bg-[#e8f5ee] text-[#13703e]' },
}

type DonationResultProps = {
  status: DonationStatus
}

// Landing page after the SSLCommerz checkout. The server only redirects to the success
// variant once the payment has been confirmed with the SSLCommerz Validation API.
// The receipt variant is the page linked from the receipt email.
function DonationResult({ status }: DonationResultProps) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('tran_id')
  const receiptRef = searchParams.get('ref')
  const isThankYou = status === 'success' || status === 'receipt'
  const needsReview = status === 'success' && searchParams.get('review') === '1'
  const style = statusStyles[status]

  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-xl rounded-[1.6rem] border border-[#dbe7ee] bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <span
          aria-hidden="true"
          className={`material-symbols-outlined mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[2.2rem] ${style.iconClass}`}
        >
          {style.icon}
        </span>
        <h1 className="mt-6 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.04em] text-[#14324d] sm:text-[2.6rem]">
          {t(`donate.result.${status}.title`)}
        </h1>
        <p className="mt-4 text-[1rem] leading-[1.8] text-[#5d6d78]">
          {needsReview ? t('donate.result.reviewMessage') : t(`donate.result.${status}.message`)}
        </p>

        {isThankYou && receiptRef ? (
          <DonationReceiptPanel receiptRef={receiptRef} />
        ) : transactionId ? (
          <dl className="mt-7 space-y-2 rounded-[1rem] border border-[#e4edf3] bg-[#f9fcfe] px-5 py-4 text-left text-[0.94rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-[#5d6d78]">{t('donate.result.transactionLabel')}</dt>
              <dd className="break-all font-mono text-[0.86rem] text-[#14324d]">{transactionId}</dd>
            </div>
          </dl>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {isThankYou ? (
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72]"
              to="/"
            >
              {t('donate.result.homeButton')}
            </Link>
          ) : (
            <Link
              className="inline-flex items-center justify-center rounded-full bg-[#13703e] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#105f35]"
              to="/donate#donate-form"
            >
              {t('donate.result.tryAgainButton')}
            </Link>
          )}
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:bg-[#f6fbff]"
            to={isThankYou ? '/transparency' : '/'}
          >
            {isThankYou ? t('donate.result.impactButton') : t('donate.result.homeButton')}
          </Link>
        </div>

        <p className="mt-7 text-[0.86rem] leading-[1.7] text-[#5d6d78]">
          {t('donate.result.contactNote')}{' '}
          <a className="font-semibold text-[#115b82]" href="mailto:alokayon2019@gmail.com">
            alokayon2019@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}

export default DonationResult
