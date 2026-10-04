import { useTranslation } from 'react-i18next'
import { getDaysLeft, getProgressPercent, getRaisedPercent, type Campaign } from '../../lib/campaigns'
import { useTakaFormatter } from '../../lib/useTakaFormatter'

type CampaignProgressProps = {
  campaign: Campaign
  size?: 'compact' | 'large'
}

// Progress bar with "raised of goal", donor count and days left.
function CampaignProgress({ campaign, size = 'compact' }: CampaignProgressProps) {
  const { t } = useTranslation()
  const formatTaka = useTakaFormatter()
  const percent = getProgressPercent(campaign)
  const daysLeft = getDaysLeft(campaign)
  const isLarge = size === 'large'

  return (
    <div className="grid gap-2.5">
      <p className={isLarge ? 'text-[1.05rem] text-[#4f6170]' : 'text-[0.92rem] text-[#4f6170]'}>
        <span
          className={`font-serif tracking-[-0.03em] text-[#13703e] ${isLarge ? 'text-[2.2rem]' : 'text-[1.45rem]'}`}
        >
          {formatTaka(campaign.raised)}
        </span>{' '}
        {t('campaigns.progress.ofGoal', { goal: formatTaka(campaign.goal_amount) })}
      </p>
      <div
        aria-label={t('campaigns.progress.label')}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(percent)}
        aria-valuetext={t('campaigns.progress.valueText', {
          raised: formatTaka(campaign.raised),
          goal: formatTaka(campaign.goal_amount),
        })}
        className={`overflow-hidden rounded-full bg-[#e3eef4] ${isLarge ? 'h-3.5' : 'h-2.5'}`}
        role="progressbar"
      >
        <div
          className="h-full rounded-full bg-[#13703e] transition-[width] duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-[0.86rem] text-[#5d6d78]">
        <span>{t('campaigns.progress.percent', { percent: Math.floor(getRaisedPercent(campaign)) })}</span>
        <span>{t('campaigns.progress.donors', { count: campaign.donorCount })}</span>
        {daysLeft !== null ? (
          <span>
            {daysLeft === 0
              ? t('campaigns.progress.lastDay')
              : t('campaigns.progress.daysLeft', { count: daysLeft })}
          </span>
        ) : null}
      </p>
    </div>
  )
}

export default CampaignProgress
