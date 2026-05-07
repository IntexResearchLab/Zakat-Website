import type { TFunction } from 'i18next'

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
  '/assets/home/carousel-1.jpg',
  '/assets/home/volunteers-1.jpg',
  '/assets/home/carousel-2.jpg',
  '/assets/about/Donation.jpg',
  '/assets/home/carousel-3.jpg',
  '/assets/home/volunteer-2.jpg',
  '/assets/about/about-us.webp',
  '/assets/home/volunteers-1.jpg',
]

const gallerySpanMap = ['large', 'small', 'medium', 'medium', 'small', 'small', 'medium', 'small']

export const getProgramStats = (t: TFunction) =>
  t('programs.hero.stats', { returnObjects: true }) as Stat[]

export const getProgramCategories = (t: TFunction) =>
  t('programs.categories.items', { returnObjects: true }) as ProgramCategory[]

export const getFilterTabs = (t: TFunction) =>
  t('programs.categories.filters', { returnObjects: true }) as FilterTab[]

export const getFeaturedProgram = (t: TFunction) => ({
  ...(t('programs.featured', { returnObjects: true }) as FeaturedProgram),
  image: '/assets/home/carousel-1.jpg',
})

export const getFeaturedMadrasa = (t: TFunction) => ({
  ...(t('programs.featuredMadrasa', { returnObjects: true }) as FeaturedProgram),
  image: '/assets/about/about-us.webp',
})

export const getCaseStudy = (t: TFunction) => ({
  ...(t('programs.caseStudy', { returnObjects: true }) as CaseStudy),
  image: '/assets/home/volunteers-1.jpg',
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

export const getImpactHighlights = (t: TFunction) =>
  t('programs.impact.items', { returnObjects: true }) as Stat[]

export const getProgramStories = (t: TFunction) =>
  t('programs.stories.items', { returnObjects: true }) as Story[]
