import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getCampaignState, localizedCampaignText, type Campaign } from '../../lib/campaigns'
import CampaignProgress from './CampaignProgress'

type CampaignCardProps = {
  campaign: Campaign
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const { t, i18n } = useTranslation()
  const title = localizedCampaignText(campaign, 'title', i18n.language)
  const state = getCampaignState(campaign)

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-[1.35rem] border border-[#dbe7ee] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      {campaign.image_url ? (
        <img
          alt=""
          className="aspect-[16/10] w-full object-cover"
          decoding="async"
          loading="lazy"
          src={campaign.image_url}
        />
      ) : (
        <div
          aria-hidden="true"
          className="aspect-[16/10] w-full bg-[linear-gradient(135deg,#115b82,#13703e)]"
        />
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        {state === 'ended' ? (
          <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#5d6d78]">
            {t('campaigns.state.ended')}
          </p>
        ) : null}
        <h3 className="font-serif text-[1.45rem] leading-tight tracking-[-0.02em] text-[#14324d]">
          {title}
        </h3>
        <p className="text-[0.95rem] leading-[1.7] text-[#4f6170]">
          {localizedCampaignText(campaign, 'summary', i18n.language)}
        </p>
        <div className="mt-auto grid gap-4">
          <CampaignProgress campaign={campaign} />
          <Link
            aria-label={t('campaigns.card.linkLabel', { title })}
            className="inline-flex items-center justify-center rounded-full bg-[#13703e] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#105f35]"
            to={`/campaigns/${campaign.slug}`}
          >
            {state === 'ended' ? t('campaigns.card.viewResult') : t('campaigns.card.give')}
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CampaignCard
