import type { TFunction } from 'i18next'

type TrustIndicator = {
  icon: string
  label: string
}

type FeaturedDonor = {
  eyebrow: string
  title: string
  quote: string
  name: string
  role: string
  location: string
}

type DonorCard = {
  quote: string
  name: string
  role: string
  location: string
}

type MapPoint = {
  country: string
  label: string
  top: string
  left: string
}

type Story = {
  title: string
  summary: string
  paragraphs: string[]
  name: string
  role: string
  image?: string
}

const storyPortraits: Record<string, string> = {
  'Affan Abbasi': '/assets/about/affan-abbasi.jpeg',
}

export const getDonorTrustIndicators = (t: TFunction) =>
  t('donors.trustIndicators.items', { returnObjects: true }) as TrustIndicator[]

export const getFeaturedDonor = (t: TFunction) =>
  t('donors.featured', { returnObjects: true }) as FeaturedDonor

export const getDonorCards = (t: TFunction) =>
  t('donors.cards.items', { returnObjects: true }) as DonorCard[]

export const getMapPoints = (t: TFunction) =>
  t('donors.globalSupport.points', { returnObjects: true }) as MapPoint[]

export const getDonorStories = (t: TFunction) => {
  const stories = t('donors.stories.items', { returnObjects: true }) as Story[]

  return stories.map((story) => ({
    ...story,
    image: storyPortraits[story.name],
  }))
}

export const getWhyTrustPoints = (t: TFunction) =>
  t('donors.whyTrust.points', { returnObjects: true }) as string[]
