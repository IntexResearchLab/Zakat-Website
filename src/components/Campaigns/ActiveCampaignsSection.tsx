import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { isCampaignOpen } from '../../lib/campaigns'
import { useCampaigns } from '../../lib/useCampaigns'
import CampaignCard from './CampaignCard'

// Up to three running appeals. Renders nothing when no campaign is open.
function ActiveCampaignsSection() {
  const { t } = useTranslation()
  const { campaigns } = useCampaigns()
  const openCampaigns = (campaigns ?? []).filter(isCampaignOpen)

  if (!openCampaigns.length) {
    return null
  }

  return (
    <section aria-labelledby="active-campaigns-title" className="bg-[#f7fbfd] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
              {t('campaigns.section.eyebrow')}
            </p>
            <h2
              className="mt-4 font-serif text-[2.3rem] leading-[1] tracking-[-0.04em] text-[#14324d] sm:text-[2.8rem]"
              id="active-campaigns-title"
            >
              {t('campaigns.section.title')}
            </h2>
          </div>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#14324d] transition hover:border-[#bdd6e4] hover:bg-[#edf7fc]"
            to="/campaigns"
          >
            {t('campaigns.section.viewAll')}
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openCampaigns.slice(0, 3).map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActiveCampaignsSection
