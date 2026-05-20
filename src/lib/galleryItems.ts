import { supabase } from '../utils/supabase'

export type GallerySpan = 'large' | 'medium' | 'small'

export type GalleryRecord = {
  id: string
  title: string
  description: string
  story: string
  location: string
  year: string
  image_url: string
  filter_id: string
  span: GallerySpan
  sort_order: number
  is_active: boolean
  created_at: string | null
}

const galleryStorageKey = 'alokayon_gallery_items_cache'

export const getCachedGalleryItems = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const cachedValue = window.localStorage.getItem(galleryStorageKey)

  if (!cachedValue) {
    return null
  }

  try {
    return JSON.parse(cachedValue) as GalleryRecord[]
  } catch {
    window.localStorage.removeItem(galleryStorageKey)
    return null
  }
}

export const cacheGalleryItems = (items: GalleryRecord[]) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(galleryStorageKey, JSON.stringify(items))
}

export const invalidateGalleryItemsCache = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(galleryStorageKey)
  }
}

export const loadGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  const rows = ((data ?? []) as GalleryRecord[]).filter((row) => row.image_url && row.title)
  cacheGalleryItems(rows)
  return rows
}
