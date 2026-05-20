import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MosaicGallerySection from '../reusables/MosaicGallerySection'
import {
  getGalleryCategoryLabel,
  getGalleryFilters,
  getGalleryItems,
  type GalleryItem,
} from './data'
import {
  getCachedGalleryItems,
  loadGalleryItems,
  type GalleryRecord,
} from '../../lib/galleryItems'

function GalleryGrid() {
  const { t } = useTranslation()
  const filters = getGalleryFilters(t)
  const fallbackItems = getGalleryItems(t)
  const [remoteItems, setRemoteItems] = useState<GalleryRecord[]>(() => getCachedGalleryItems() ?? [])

  useEffect(() => {
    let isMounted = true

    const syncGalleryItems = async () => {
      try {
        const rows = await loadGalleryItems()
        if (isMounted) {
          setRemoteItems(rows)
        }
      } catch {
        // The fallback gallery content is intentionally kept in code.
      }
    }

    void syncGalleryItems()

    return () => {
      isMounted = false
    }
  }, [])

  const items = useMemo<GalleryItem[]>(
    () =>
      remoteItems.length
        ? remoteItems.map((item) => ({
            category: getGalleryCategoryLabel(t, item.filter_id),
            title: item.title,
            description: item.description,
            story: item.story,
            location: item.location,
            year: item.year,
            image: item.image_url,
            filterId: item.filter_id,
            span: item.span,
          }))
        : fallbackItems,
    [fallbackItems, remoteItems, t],
  )

  return (
    <MosaicGallerySection
      closeLabel={t('galleryPage.grid.closeImage')}
      description={t('galleryPage.grid.description')}
      eyebrow={t('galleryPage.grid.eyebrow')}
      filters={filters}
      items={items}
      locationLabel={t('galleryPage.grid.locationLabel')}
      title={t('galleryPage.grid.title')}
      yearLabel={t('galleryPage.grid.yearLabel')}
    />
  )
}

export default GalleryGrid
