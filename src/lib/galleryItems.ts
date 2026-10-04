import { supabase } from '../utils/supabase'
import { readStorage, writeStorage, removeStorage } from './safeStorage'

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

  const cachedValue = readStorage(galleryStorageKey)

  if (!cachedValue) {
    return null
  }

  try {
    return JSON.parse(cachedValue) as GalleryRecord[]
  } catch {
    removeStorage(galleryStorageKey)
    return null
  }
}

export const cacheGalleryItems = (items: GalleryRecord[]) => {
  if (typeof window === 'undefined') {
    return
  }

  writeStorage(galleryStorageKey, JSON.stringify(items))
}

export const invalidateGalleryItemsCache = () => {
  if (typeof window !== 'undefined') {
    removeStorage(galleryStorageKey)
  }
}

export const loadGalleryItems = async () => {
  const { data, error } = await supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  const allRows = (data ?? []) as GalleryRecord[]
  const rows = allRows.filter((row) => row.is_active && row.image_url && row.title)
  cacheGalleryItems(rows)
  // hasAnyRows tells "the admin hid everything" (show nothing) apart from "nothing has been
  // added yet" (show the built-in example content).
  return { rows, hasAnyRows: allRows.length > 0 }
}
