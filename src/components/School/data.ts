import type { TFunction } from 'i18next'
import {
  getSchoolImpactStatsFromInventory,
  getSchoolOutcomesFromInventory,
} from '../../content/stats'

type TimelineItem = {
  label: string
  title: string
}

type GalleryItem = {
  title: string
}

const schoolGalleryImages = [
  '/assets/home/celebration.webp',
  '/assets/school/School_3.webp',
  '/assets/home/Alokayon_School_1.webp',
  '/assets/about/Donating_3.webp',
  '/assets/school/School_6.webp',
  '/assets/about/Donation_5.webp',
]

export const getSchoolImpactStats = (t: TFunction) => getSchoolImpactStatsFromInventory(t)

export const getSchoolTimeline = (t: TFunction) =>
  t('school.founding.timeline', { returnObjects: true }) as TimelineItem[]

export const getStudentSupportItems = (t: TFunction) =>
  t('school.support.items', { returnObjects: true }) as string[]

export const getSchoolGallery = (t: TFunction) => {
  const items = t('school.gallery.items', { returnObjects: true }) as GalleryItem[]

  return items.map((item, index) => ({
    ...item,
    image: schoolGalleryImages[index],
  }))
}

export const getSchoolOutcomes = (t: TFunction) => getSchoolOutcomesFromInventory(t)

export const getSchoolTrustBadges = (t: TFunction) =>
  t('school.trust.badges', { returnObjects: true }) as string[]
