import type { TFunction } from 'i18next'

type ImpactStat = {
  value: string
  label: string
}

type TimelineItem = {
  year: string
  title: string
}

type PurposeSection = {
  eyebrow: string
  title: string
  text: string
  bullets: string[]
  imageAlt: string
}

type CommitteeMember = {
  name: string
  role: string
  email?: string
  phone?: string
  image?: string
}

const purposeImages = [
  {
    image: '/assets/about/Donating.webp',
    secondaryImage: '/assets/about/Donating_4.webp',
  },
  {
    image: '/assets/about/Donating_2.webp',
    secondaryImage: '/assets/about/Donation_5.webp',
  },
  {
    image: '/assets/about/Donating_3.webp',
    secondaryImage: '/assets/about/Donation_6.webp',
  },
]

export const getImpactStats = (t: TFunction) =>
  t('about.purpose.stats', { returnObjects: true }) as ImpactStat[]

export const getTimeline = (t: TFunction) =>
  t('about.journey.timeline', { returnObjects: true }) as TimelineItem[]

export const getCommitteeMembers = (t: TFunction) => {
  const members = t('about.executive.members', { returnObjects: true }) as CommitteeMember[]

  return members.map((member) => ({
    ...member,
    image: member.image ?? null,
  }))
}

export const getPurposeSections = (t: TFunction) => {
  const sections = t('about.purposeSections.items', {
    returnObjects: true,
  }) as PurposeSection[]

  return sections.map((section, index) => ({
    ...section,
    image: purposeImages[index].image,
    secondaryImage: purposeImages[index].secondaryImage,
  }))
}
