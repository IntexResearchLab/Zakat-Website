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
}

const donorPortraits = [
  '/assets/about/person-1.jpg',
  '/assets/about/person-2.jpg',
  '/assets/about/person-3.jpg',
  '/assets/about/person-4.jpg',
]

export const getDonorTrustIndicators = (t: TFunction) =>
  t('donors.trustIndicators.items', { returnObjects: true }) as TrustIndicator[]

export const getFeaturedDonor = (t: TFunction) => ({
  ...(t('donors.featured', { returnObjects: true }) as FeaturedDonor),
  image: '/assets/about/Donation.jpg',
})

export const getDonorCards = (t: TFunction) => {
  const cards = t('donors.cards.items', { returnObjects: true }) as DonorCard[]

  return cards.map((card, index) => ({
    ...card,
    image: donorPortraits[index % donorPortraits.length],
  }))
}

export const getMapPoints = (t: TFunction) =>
  t('donors.globalSupport.points', { returnObjects: true }) as MapPoint[]

export const getDonorStories = (t: TFunction) =>
  t('donors.stories.items', { returnObjects: true }) as Story[]

export const getWhyTrustPoints = (t: TFunction) =>
  t('donors.whyTrust.points', { returnObjects: true }) as string[]
