import type { TFunction } from 'i18next'

type FeaturedStory = {
  eyebrow: string
  title: string
  badges: string[]
  summary: string
  summaryTwo: string
  fullStory: string[]
}

type TestimonialCard = {
  title: string
  quote: string
  tags: string[]
  name: string
  role: string
  location: string
}

type Story = {
  quote: string
  name: string
  role: string
}

export const getFeaturedStory = (t: TFunction) =>
  t('opinions.featuredStory', { returnObjects: true }) as FeaturedStory

export const getTestimonialCards = (t: TFunction) =>
  t('opinions.grid.cards', { returnObjects: true }) as TestimonialCard[]

export const getEducationStories = (t: TFunction) =>
  t('opinions.themes.education.items', { returnObjects: true }) as Story[]

export const getFamilySupportStories = (t: TFunction) =>
  t('opinions.themes.family.items', { returnObjects: true }) as Story[]

export const getReliefStories = (t: TFunction) => {
  const items = t('opinions.themes.relief.items', { returnObjects: true }) as Story[]

  return items.map((item) => ({
    ...item,
    image: '/assets/home/volunteers-1.jpg',
  }))
}

export const getImpactSummary = (t: TFunction) =>
  t('opinions.impactSummary.points', { returnObjects: true }) as string[]
