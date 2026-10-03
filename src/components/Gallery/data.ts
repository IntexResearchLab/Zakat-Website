import type { TFunction } from 'i18next'

export type GalleryItem = {
  id: string
  category: string
  title: string
  description: string
  story: string
  location: string
  year: string
  image: string
  filterId: string
  span: 'large' | 'medium' | 'small'
}

export type GalleryFilter = {
  id: string
  label: string
}

type FeaturedStory = {
  title: string
  description: string
  linkLabel: string
}

const galleryImageMap = [
  '/assets/home/Alokayon_School_1.jpg',
  '/assets/home/celebration.jpg',
  '/assets/about/donors-community.jpg',
  '/assets/about/Donating.jpg',
  '/assets/about/Giving.jpg',
  '/assets/about/community-support.jpg',
  '/assets/about/book-distribution.jpg',
  '/assets/school/School_2.jpg',
]

const galleryCategoryMap = [
  'education',
  'relief',
  'livelihood',
  'healthcare',
  'madrasa',
  'pathshala',
  'education',
  'relief',
] as const

const gallerySpanMap: GalleryItem['span'][] = [
  'large',
  'small',
  'medium',
  'small',
  'medium',
  'small',
  'small',
  'medium',
]

const featuredImageMap = [
  '/assets/school/School_2.jpg',
  '/assets/school/School_3.jpg',
  '/assets/programs/Livelihood.jpeg',
]

const featuredLinkMap = ['/programs/alokayon-school', '/programs/madrasa', '/programs']

export const getGalleryFilters = (t: TFunction) =>
  t('galleryPage.filters', { returnObjects: true }) as GalleryFilter[]

export const getGalleryItems = (t: TFunction) => {
  const items = t('galleryPage.grid.items', {
    returnObjects: true,
  }) as Array<Omit<GalleryItem, 'id' | 'image' | 'filterId' | 'span'>>

  return items.map((item, index) => ({
    ...item,
    id: `fallback-${index}`,
    image: galleryImageMap[index % galleryImageMap.length],
    filterId: galleryCategoryMap[index % galleryCategoryMap.length],
    span: gallerySpanMap[index % gallerySpanMap.length],
  }))
}

export const getGalleryCategoryLabel = (t: TFunction, filterId: string) => {
  const filters = getGalleryFilters(t)
  return filters.find((filter) => filter.id === filterId)?.label ?? filterId
}

export const getFeaturedStories = (t: TFunction) => {
  const items = t('galleryPage.featured.items', {
    returnObjects: true,
  }) as FeaturedStory[]

  return items.map((item, index) => ({
    ...item,
    image: featuredImageMap[index % featuredImageMap.length],
    href: featuredLinkMap[index % featuredLinkMap.length],
  }))
}
