import { useTranslation } from 'react-i18next'

function DonationSection() {
  const { t } = useTranslation()

  return (
    <section className="bg-[#f4f7f2] py-16 sm:py-18">
      <div className="mx-auto max-w-7xl px-6">
        <div className="overflow-hidden rounded-[1.2rem] bg-[linear-gradient(135deg,#0d4768,#115b82_52%,#6eaed8)] px-8 py-8 shadow-[0_20px_50px_rgba(17,91,130,0.18)] sm:px-10 sm:py-9 lg:px-12 lg:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#dcefff]">
                {t('home.donation.eyebrow')}
              </p>
              <h2 className="max-w-xl font-serif text-[2.4rem] leading-[0.98] tracking-[-0.04em] text-white sm:text-[3rem]">
                {t('home.donation.title')}
              </h2>
              <p className="mt-5 max-w-[29rem] text-[0.98rem] leading-[1.6] text-white/82">
                {t('home.donation.description')}
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:min-w-[16rem] lg:items-start">
              <a
                className="inline-flex items-center justify-center self-start rounded-full bg-[#1d621f] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#174f19]"
                href="#"
              >
                {t('common.actions.donateNow')}
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#e8f6ff] transition hover:gap-3 hover:text-white"
                href="#"
              >
                {t('common.actions.readOurMagazine')}
                <span aria-hidden="true">→</span>
              </a>
              <p className="text-[0.72rem] tracking-[0.06em] text-white/62">
                {t('common.payments.accepted')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DonationSection
