import type { TFunction } from 'i18next'
import { getMadrasaImpactStatsFromInventory } from '../../content/stats'

type Feature = {
  icon: string
  title: string
  text: string
}

type PathwayItem = {
  label: string
  title: string
  text: string
}

type GalleryItem = {
  title: string
}

const madrasaGalleryImages = [
  '/assets/home/carousel-2.jpg',
  '/assets/home/carousel-1.jpg',
  '/assets/home/volunteers-1.jpg',
  '/assets/home/carousel-3.jpg',
  '/assets/about/Donation.jpg',
]

export const getMadrasaImpactStats = (t: TFunction) => getMadrasaImpactStatsFromInventory(t)

export const getMadrasaFeatures = (t: TFunction) =>
  t('madrasa.features.items', { returnObjects: true }) as Feature[]

export const getMadrasaPathway = (t: TFunction) =>
  t('madrasa.pathway.items', { returnObjects: true }) as PathwayItem[]

export const getMadrasaSupportItems = (t: TFunction) =>
  t('madrasa.support.items', { returnObjects: true }) as string[]

export const getMadrasaGallery = (t: TFunction) => {
  const items = t('madrasa.gallery.items', { returnObjects: true }) as GalleryItem[]

  return items.map((item, index) => ({
    ...item,
    image: madrasaGalleryImages[index],
  }))
}

export const getMadrasaTrustPoints = (t: TFunction) =>
  t('madrasa.leadership.points', { returnObjects: true }) as string[]
