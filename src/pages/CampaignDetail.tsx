import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import CampaignProgress from '../components/Campaigns/CampaignProgress'
import Breadcrumb from '../components/reusables/Breadcrumb'
import { getCampaignState, localizedCampaignText } from '../lib/campaigns'
import { useCampaigns } from '../lib/useCampaigns'
import NotFound from './NotFound'

function CampaignDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const { campaigns, isLoading } = useCampaigns()
  const campaign = campaigns?.find((item) => item.slug === slug && item.is_active)

  if (isLoading) {
    return <p className="px-6 py-24 text-center text-[#5d6d78]">{t('campaigns.page.loading')}</p>
  }

  if (!campaign || getCampaignState(campaign) === 'upcoming') {
    return <NotFound />
  }

  const title = localizedCampaignText(campaign, 'title', i18n.language)
  const story = localizedCampaignText(campaign, 'story', i18n.language)
  const isEnded = getCampaignState(campaign) === 'ended'

  return (
    <div className="bg-white">
      <section className="border-b border-[#d8e5ec] bg-[#f7fbfd]">
        <div className="mx-auto max-w-6xl px-6 pt-12">
          <Breadcrumb
            items={[
              { label: t('common.breadcrumb.campaigns'), to: '/campaigns' },
              { label: title },
            ]}
          />
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="min-w-0">
            <h1 className="font-serif text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#101d2b] sm:text-[3.1rem]">
              {title}
            </h1>
            <p className="mt-5 text-[1.08rem] leading-[1.8] text-[#4f6170]">
              {localizedCampaignText(campaign, 'summary', i18n.language)}
            </p>
            {campaign.image_url ? (
              <img
                alt=""
                className="mt-8 aspect-[16/10] w-full rounded-[1.4rem] object-cover"
                decoding="async"
                fetchPriority="high"
                src={campaign.image_url}
              />
            ) : null}
          </div>

          <aside className="rounded-[1.4rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)] lg:sticky lg:top-28">
            <CampaignProgress campaign={campaign} size="large" />
            {isEnded ? (
              <>
                <p className="mt-6 text-[0.95rem] leading-[1.7] text-[#4f6170]">
                  {t('campaigns.detail.endedNote')}
                </p>
                <Link
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#d7e6ef] bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:bg-[#f6fbff]"
                  to="/donate"
                >
                  {t('campaigns.detail.donateGeneral')}
                </Link>
              </>
            ) : (
              <Link
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#13703e] px-6 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_30px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
                to={`/donate?campaign=${campaign.slug}&category=${campaign.category}#donate-form`}
              >
                {t('campaigns.detail.donate')}
              </Link>
            )}
            <p className="mt-4 text-[0.84rem] leading-[1.6] text-[#5d6d78]">
              {t('campaigns.detail.privacyNote')}
            </p>
          </aside>
        </div>
      </section>

      {story ? (
        <section className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="font-serif text-[1.8rem] leading-tight tracking-[-0.03em] text-[#14324d]">
            {t('campaigns.detail.storyTitle')}
          </h2>
          <div className="mt-6 grid gap-5">
            {story
              .split(/\n\s*\n/)
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, index) => (
                <p className="text-[1.02rem] leading-[1.85] text-[#4f6170]" key={index}>
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default CampaignDetail
