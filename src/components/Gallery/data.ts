import type { TFunction } from 'i18next'

export type GalleryItem = {
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
  '/assets/home/carousel-3.jpg',
  '/assets/home/carousel-2.jpg',
  '/assets/home/volunteers-1.jpg',
  '/assets/about/Donation.jpg',
  '/assets/about/about-us.webp',
  '/assets/home/volunteer-2.jpg',
  '/assets/home/carousel-1.jpg',
  '/assets/home/carousel-2.jpg',
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
  '/assets/home/volunteer-2.jpg',
  '/assets/about/about-us.webp',
  '/assets/home/volunteers-1.jpg',
]

const featuredLinkMap = ['/programs/alokayon-school', '/programs/madrasa', '/programs']

export const getGalleryFilters = (t: TFunction) =>
  t('galleryPage.filters', { returnObjects: true }) as GalleryFilter[]

export const getGalleryItems = (t: TFunction) => {
  const items = t('galleryPage.grid.items', {
    returnObjects: true,
  }) as Array<Omit<GalleryItem, 'image' | 'filterId' | 'span'>>

  return items.map((item, index) => ({
    ...item,
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
