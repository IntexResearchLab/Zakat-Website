import type { TFunction } from 'i18next'

type ImpactStat = {
  value: string
  label: string
}

type Program = {
  icon: string
  title: string
  description: string
}

type TimelineItem = {
  year: string
  title: string
}

type Testimonial = {
  quote: string
  author: string
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
}

const committeeImages = [
  '/assets/about/person-1.jpg',
  '/assets/about/person-2.jpg',
  '/assets/about/person-3.jpg',
  '/assets/about/person-4.jpg',
]

const purposeImages = [
  {
    image: '/assets/home/volunteers-1.jpg',
    secondaryImage: '/assets/about/Donation.jpg',
  },
  {
    image: '/assets/about/Donation.jpg',
    secondaryImage: '/assets/home/carousel-1.jpg',
  },
  {
    image: '/assets/home/carousel-2.jpg',
    secondaryImage: '/assets/home/carousel-3.jpg',
  },
]

export const getImpactStats = (t: TFunction) =>
  t('about.purpose.stats', { returnObjects: true }) as ImpactStat[]

export const getPrograms = (t: TFunction) =>
  t('about.programs.items', { returnObjects: true }) as Program[]

export const getTimeline = (t: TFunction) =>
  t('about.journey.timeline', { returnObjects: true }) as TimelineItem[]

export const getTestimonials = (t: TFunction) =>
  t('about.voices.testimonials', { returnObjects: true }) as Testimonial[]

export const getTrustPoints = (t: TFunction) =>
  t('about.trust.points', { returnObjects: true }) as string[]

export const getCommitteeMembers = (t: TFunction) => {
  const members = t('about.executive.members', { returnObjects: true }) as CommitteeMember[]

  return members.map((member, index) => ({
    ...member,
    image: committeeImages[index % committeeImages.length],
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
