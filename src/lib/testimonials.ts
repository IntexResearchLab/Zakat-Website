import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabase'

export type TestimonialKind = 'beneficiary' | 'donor'

export type TestimonialRecord = {
  id: string
  kind: TestimonialKind
  name: string
  name_bn: string | null
  role_en: string | null
  role_bn: string | null
  location_en: string | null
  location_bn: string | null
  quote_en: string
  quote_bn: string | null
  headline_en: string | null
  headline_bn: string | null
  tags_en: string | null
  tags_bn: string | null
  show_on_home: boolean
  is_active: boolean
  sort_order: number
  created_at: string
}

// What the public sections display, already in the visitor's language.
export type Testimonial = {
  id: string
  headline: string
  quote: string
  name: string
  role: string
  location: string
  tags: string[]
}

let cache: TestimonialRecord[] | null = null
let inFlight: Promise<TestimonialRecord[]> | null = null

export const invalidateTestimonialsCache = () => {
  cache = null
}

export const loadTestimonials = () => {
  inFlight ??= (async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    cache = (data ?? []) as TestimonialRecord[]
    return cache
  })().finally(() => {
    inFlight = null
  })

  return inFlight
}

const pick = (english: string | null, bangla: string | null, language: string) =>
  (language === 'bn' && bangla?.trim() ? bangla : english)?.trim() ?? ''

export const toTestimonial = (record: TestimonialRecord, language: string): Testimonial => ({
  id: record.id,
  headline: pick(record.headline_en, record.headline_bn, language),
  quote: pick(record.quote_en, record.quote_bn, language),
  name: pick(record.name, record.name_bn, language),
  role: pick(record.role_en, record.role_bn, language),
  location: pick(record.location_en, record.location_bn, language),
  tags: pick(record.tags_en, record.tags_bn, language)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
})

type TranslatedQuote = {
  quote: string
  name: string
  role?: string
  location?: string
  title?: string
  category?: string
  tags?: string[]
}

// The built-in quotes from the translation files, in the same shape as admin-managed ones.
export const fromTranslations = (items: TranslatedQuote[]): Testimonial[] =>
  (Array.isArray(items) ? items : []).map((item, index) => ({
    id: `built-in-${index}`,
    headline: item.title ?? item.category ?? '',
    quote: item.quote,
    name: item.name,
    role: item.role ?? '',
    location: item.location ?? '',
    tags: item.tags ?? [],
  }))

type Selection = 'beneficiary' | 'donor' | 'home'

// Quotes for one section. Until the admin has added any entries of that kind (or if they can't
// be loaded), the section keeps showing its built-in quotes from the translation files.
export const useTestimonials = (selection: Selection, fallback: Testimonial[]) => {
  const { i18n } = useTranslation()
  const [records, setRecords] = useState<TestimonialRecord[] | null>(() => cache)

  useEffect(() => {
    let isMounted = true

    loadTestimonials()
      .then((rows) => {
        if (isMounted) {
          setRecords(rows)
        }
      })
      .catch((error: unknown) => console.error('[testimonials]', error))

    return () => {
      isMounted = false
    }
  }, [])

  const kinds: TestimonialKind[] = selection === 'home' ? ['beneficiary', 'donor'] : [selection]
  const relevant = (records ?? []).filter((record) => kinds.includes(record.kind))

  if (!relevant.length) {
    return fallback
  }

  const active = relevant.filter((record) => record.is_active)
  // The home carousel shows the entries ticked for it, or the first few if none are ticked.
  const chosen =
    selection === 'home'
      ? active.some((record) => record.show_on_home)
        ? active.filter((record) => record.show_on_home)
        : active.slice(0, 5)
      : active

  return chosen.map((record) => toTestimonial(record, i18n.language))
}
