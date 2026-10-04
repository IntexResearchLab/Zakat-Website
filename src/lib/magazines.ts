import { supabase } from './supabase'
import type { MagazineIssue } from '../components/Transparency/types'
import { readStorage, writeStorage, removeStorage } from './safeStorage'

type MagazineRow = {
  id: string
  title: string
  year: number
  description: string | null
  pdf_url: string
  cover_image_url: string | null
}

type MagazineRowsResult = {
  data: MagazineRow[] | null
  error: { message: string } | null
}

let magazineRowsCache: MagazineRow[] | null = null
const magazineRowsStorageKey = 'alokayon_magazines_cache'

export const fetchMagazineRows = async (options?: { forceRefresh?: boolean }) => {
  if (!options?.forceRefresh && magazineRowsCache) {
    return { data: magazineRowsCache, error: null }
  }

  if (!options?.forceRefresh && typeof window !== 'undefined') {
    // A damaged cache must not break the page: fall through to a fresh load.
    try {
      const cachedValue = readStorage(magazineRowsStorageKey)
      const parsedRows = cachedValue ? (JSON.parse(cachedValue) as unknown) : null
      if (Array.isArray(parsedRows)) {
        magazineRowsCache = parsedRows as MagazineRow[]
        return { data: magazineRowsCache, error: null }
      }
    } catch {
      invalidateMagazineRowsCache()
    }
  }

  const result = await supabase
    .from('magazines')
    .select('id, title, year, description, pdf_url, cover_image_url')
    .order('year', { ascending: false })
    .order('created_at', { ascending: false })

  if (!result.error) {
    const rows = (result.data ?? []) as MagazineRow[]
    magazineRowsCache = rows
    writeStorage(magazineRowsStorageKey, JSON.stringify(rows))
    return {
      data: rows,
      error: null,
    } satisfies MagazineRowsResult
  }

  return {
    data: null,
    error: { message: result.error.message },
  } satisfies MagazineRowsResult
}

export const invalidateMagazineRowsCache = () => {
  magazineRowsCache = null
  removeStorage(magazineRowsStorageKey)
}

export const getCachedMagazineIssues = (sections: string[]) =>
  magazineRowsCache ? mapMagazineRowsToIssues(magazineRowsCache, sections) : null

export const mapMagazineRowsToIssues = (
  rows: MagazineRow[],
  sections: string[],
): MagazineIssue[] =>
  rows.map((row) => ({
    id: row.id,
    year: String(row.year),
    title: row.title,
    description: row.description?.trim() || '',
    pdfUrl: row.pdf_url,
    coverImageUrl: row.cover_image_url,
    sections,
  }))
