import type { TFunction } from 'i18next'

type Stat = {
  value: string
  label: string
}

type TimelineItem = {
  label: string
  title: string
}

type GalleryItem = {
  title: string
}

type Outcome = {
  year: string
  value: string
  label: string
}

const schoolGalleryImages = [
  '/assets/home/carousel-1.jpg',
  '/assets/home/carousel-2.jpg',
  '/assets/home/carousel-3.jpg',
  '/assets/home/volunteers-1.jpg',
  '/assets/about/Donation.jpg',
  '/assets/about/about-us.webp',
]

export const getSchoolImpactStats = (t: TFunction) =>
  t('school.impact.items', { returnObjects: true }) as Stat[]

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

export const getSchoolOutcomes = (t: TFunction) =>
  t('school.outcomes.items', { returnObjects: true }) as Outcome[]

export const getSchoolTrustBadges = (t: TFunction) =>
  t('school.trust.badges', { returnObjects: true }) as string[]
