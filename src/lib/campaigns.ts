import { supabase } from './supabase'

export type CampaignRecord = {
  id: string
  slug: string
  title_en: string
  title_bn: string | null
  summary_en: string
  summary_bn: string | null
  story_en: string | null
  story_bn: string | null
  image_url: string | null
  goal_amount: number
  category: string
  starts_on: string | null
  ends_on: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export type Campaign = CampaignRecord & {
  raised: number
  donorCount: number
}

type CampaignTotal = { campaign_id: string; raised: number | string; donor_count: number | string }

let campaignsCache: Campaign[] | null = null

export const getCachedCampaigns = () => campaignsCache

export const invalidateCampaignsCache = () => {
  campaignsCache = null
}

let inFlight: Promise<Campaign[]> | null = null

// Campaigns with their progress. Sections that ask at the same time share one request.
export const loadCampaigns = () => {
  inFlight ??= fetchCampaigns().finally(() => {
    inFlight = null
  })
  return inFlight
}

// Totals come from a database function that only returns sums, because visitors are not
// allowed to read individual donations.
const fetchCampaigns = async () => {
  const [campaignsResult, totalsResult] = await Promise.all([
    supabase
      .from('campaigns')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase.rpc('campaign_totals'),
  ])

  if (campaignsResult.error) {
    throw campaignsResult.error
  }

  // Progress is a nice-to-have: show campaigns even if the totals can't be loaded.
  if (totalsResult.error) {
    console.error('[campaigns] totals', totalsResult.error)
  }

  const totals = new Map(
    ((totalsResult.data ?? []) as CampaignTotal[]).map((row) => [
      row.campaign_id,
      { raised: Number(row.raised) || 0, donorCount: Number(row.donor_count) || 0 },
    ]),
  )

  campaignsCache = ((campaignsResult.data ?? []) as CampaignRecord[]).map((campaign) => ({
    ...campaign,
    goal_amount: Number(campaign.goal_amount),
    raised: totals.get(campaign.id)?.raised ?? 0,
    donorCount: totals.get(campaign.id)?.donorCount ?? 0,
  }))

  return campaignsCache
}

// Bangla text when the visitor reads in Bangla and it has been written; English otherwise.
export const localizedCampaignText = (
  campaign: CampaignRecord,
  field: 'title' | 'summary' | 'story',
  language: string,
) => {
  const bangla = campaign[`${field}_bn`]
  return (language === 'bn' && bangla?.trim() ? bangla : campaign[`${field}_en`]) ?? ''
}

const todayInDhaka = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })

export type CampaignState = 'upcoming' | 'open' | 'ended'

export const getCampaignState = (campaign: CampaignRecord): CampaignState => {
  const today = todayInDhaka()

  if (campaign.starts_on && campaign.starts_on > today) {
    return 'upcoming'
  }
  if (campaign.ends_on && campaign.ends_on < today) {
    return 'ended'
  }
  return 'open'
}

// Calendar days until the end date: 0 on the last day, null when there is no end date or the
// campaign has already ended.
export const getDaysLeft = (campaign: CampaignRecord) => {
  if (!campaign.ends_on || getCampaignState(campaign) === 'ended') {
    return null
  }

  const today = Date.parse(`${todayInDhaka()}T00:00:00Z`)
  const end = Date.parse(`${campaign.ends_on}T00:00:00Z`)
  return Math.round((end - today) / 86_400_000)
}

// Share of the goal raised. Can go above 100 when an appeal is oversubscribed.
export const getRaisedPercent = (campaign: Campaign) =>
  campaign.goal_amount > 0 ? (campaign.raised / campaign.goal_amount) * 100 : 0

// Width of the progress bar, which stops at full.
export const getProgressPercent = (campaign: Campaign) => Math.min(100, getRaisedPercent(campaign))

// Visible to the public and still taking donations.
export const isCampaignOpen = (campaign: CampaignRecord) =>
  campaign.is_active && getCampaignState(campaign) === 'open'
