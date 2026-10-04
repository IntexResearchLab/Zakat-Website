import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import CampaignCard from '../components/Campaigns/CampaignCard'
import Breadcrumb from '../components/reusables/Breadcrumb'
import { getCampaignState } from '../lib/campaigns'
import { useCampaigns } from '../lib/useCampaigns'

function Campaigns() {
  const { t } = useTranslation()
  const { campaigns, isLoading, hasError } = useCampaigns()
  // Hidden and not-yet-started campaigns are not shown to the public.
  const visible = (campaigns ?? []).filter(
    (campaign) => campaign.is_active && getCampaignState(campaign) !== 'upcoming',
  )
  const open = visible.filter((campaign) => getCampaignState(campaign) === 'open')
  const ended = visible.filter((campaign) => getCampaignState(campaign) === 'ended')

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-14 sm:py-18">
          <Breadcrumb items={[{ label: t('common.breadcrumb.campaigns') }]} />
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#115b82]">
            {t('campaigns.page.eyebrow')}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] text-[#101d2b] sm:text-[3.4rem]">
            {t('campaigns.page.title')}
          </h1>
          <p className="mt-6 max-w-3xl text-[1.04rem] leading-[1.85] text-[#5d6d78]">
            {t('campaigns.page.intro')}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14">
        {isLoading ? (
          <p className="text-center text-[#5d6d78]">{t('campaigns.page.loading')}</p>
        ) : hasError ? (
          <p className="text-center text-[#5d6d78]">{t('campaigns.page.error')}</p>
        ) : open.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {open.map((campaign) => (
              <CampaignCard campaign={campaign} key={campaign.id} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-[1.4rem] border border-[#dbe7ee] bg-[#f7fbfd] p-8 text-center">
            <p className="font-serif text-[1.5rem] text-[#14324d]">
              {t('campaigns.page.emptyTitle')}
            </p>
            <p className="mt-3 text-[0.98rem] leading-[1.7] text-[#5d6d78]">
              {t('campaigns.page.emptyText')}
            </p>
            <Link
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#13703e] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#105f35]"
              to="/donate"
            >
              {t('common.actions.donateNow')}
            </Link>
          </div>
        )}

        {ended.length ? (
          <section aria-labelledby="ended-campaigns-title" className="mt-16">
            <h2
              className="font-serif text-[1.9rem] leading-tight tracking-[-0.03em] text-[#14324d]"
              id="ended-campaigns-title"
            >
              {t('campaigns.page.endedTitle')}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ended.map((campaign) => (
                <CampaignCard campaign={campaign} key={campaign.id} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default Campaigns
