import type { TFunction } from 'i18next'
import {
  getFeaturedMadrasaStats,
  getFeaturedSchoolStats,
  getProgramHeroStats,
  getProgramsImpactStats,
} from '../../content/stats'

type Stat = {
  value: string
  label: string
}

type FilterTab = {
  id: string
  label: string
}

type ProgramCategory = {
  id: string
  icon: string
  title: string
  description: string
  highlights: string[]
}

type FeaturedProgram = {
  eyebrow: string
  title: string
  description: string
  points: string[]
  stats: Stat[]
  cta: string
}

type CaseStudy = {
  eyebrow: string
  title: string
  problem: string
  reality: string
  intervention: string
  impact: string
  timeline: { label: string; text: string }[]
}

type Initiative = {
  icon: string
  title: string
}

type GalleryItemText = {
  title: string
  location: string
}

type Story = {
  quote: string
  person: string
  context: string
}

const galleryImageMap = [
  '/assets/programs/Education.jpeg',
  '/assets/programs/Relief.jpg',
  '/assets/programs/Livelihood.jpeg',
  '/assets/programs/Elderly_Care.jpg',
  '/assets/programs/School.jpeg',
  '/assets/programs/Relief.jpg',
  '/assets/programs/Community.jpg',
  '/assets/programs/School.jpeg',
]

const gallerySpanMap = ['large', 'small', 'medium', 'medium', 'small', 'small', 'medium', 'small']

export const getProgramStats = (t: TFunction) => getProgramHeroStats(t)

export const getProgramCategories = (t: TFunction) =>
  t('programs.categories.items', { returnObjects: true }) as ProgramCategory[]

export const getFilterTabs = (t: TFunction) =>
  t('programs.categories.filters', { returnObjects: true }) as FilterTab[]

export const getFeaturedProgram = (t: TFunction) => ({
  ...(t('programs.featured', { returnObjects: true }) as FeaturedProgram),
  stats: getFeaturedSchoolStats(t),
  image: '/assets/programs/School.jpeg',
})

export const getFeaturedMadrasa = (t: TFunction) => ({
  ...(t('programs.featuredMadrasa', { returnObjects: true }) as FeaturedProgram),
  stats: getFeaturedMadrasaStats(t),
  image: '/assets/programs/Education.jpeg',
})

export const getCaseStudy = (t: TFunction) => ({
  ...(t('programs.caseStudy', { returnObjects: true }) as CaseStudy),
  image: '/assets/programs/Community.jpg',
})

export const getInitiatives = (t: TFunction) =>
  t('programs.initiatives.items', { returnObjects: true }) as Initiative[]

export const getGalleryFilters = (t: TFunction) =>
  t('programs.gallery.filters', { returnObjects: true }) as FilterTab[]

export const getGalleryItems = (t: TFunction) => {
  const items = t('programs.gallery.items', { returnObjects: true }) as Array<
    GalleryItemText & { program: string }
  >

  return items.map((item, index) => ({
    ...item,
    image: galleryImageMap[index],
    span: gallerySpanMap[index],
  }))
}

export const getImpactHighlights = (t: TFunction) => getProgramsImpactStats(t)

export const getProgramStories = (t: TFunction) =>
  t('programs.stories.items', { returnObjects: true }) as Story[]
