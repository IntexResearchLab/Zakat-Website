import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from './supabase'

export type StoryKind = 'beneficiary' | 'donor'

export type StoryRecord = {
  id: string
  kind: StoryKind
  title_en: string
  title_bn: string | null
  summary_en: string
  summary_bn: string | null
  body_en: string | null
  body_bn: string | null
  name: string | null
  name_bn: string | null
  role_en: string | null
  role_bn: string | null
  badges_en: string | null
  badges_bn: string | null
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

// What the public sections display, already in the visitor's language.
export type Story = {
  id: string
  title: string
  summary: string[]
  body: string[]
  name: string
  role: string
  badges: string[]
  image: string | null
}

let cache: StoryRecord[] | null = null
let inFlight: Promise<StoryRecord[]> | null = null

export const invalidateStoriesCache = () => {
  cache = null
}

export const loadStories = () => {
  inFlight ??= (async () => {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      throw error
    }

    cache = (data ?? []) as StoryRecord[]
    return cache
  })().finally(() => {
    inFlight = null
  })

  return inFlight
}

const pick = (english: string | null, bangla: string | null, language: string) =>
  (language === 'bn' && bangla?.trim() ? bangla : english)?.trim() ?? ''

export const splitParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

export const toStory = (record: StoryRecord, language: string): Story => ({
  id: record.id,
  title: pick(record.title_en, record.title_bn, language),
  summary: splitParagraphs(pick(record.summary_en, record.summary_bn, language)),
  body: splitParagraphs(pick(record.body_en, record.body_bn, language)),
  name: pick(record.name, record.name_bn, language),
  role: pick(record.role_en, record.role_bn, language),
  badges: pick(record.badges_en, record.badges_bn, language)
    .split(',')
    .map((badge) => badge.trim())
    .filter(Boolean),
  image: record.image_url,
})

// Stories for one section. Until the admin has added any of that kind (or if they can't be
// loaded), the section keeps showing its built-in stories from the translation files.
export const useStories = (kind: StoryKind, fallback: Story[]) => {
  const { i18n } = useTranslation()
  const [records, setRecords] = useState<StoryRecord[] | null>(() => cache)

  useEffect(() => {
    let isMounted = true

    loadStories()
      .then((rows) => {
        if (isMounted) {
          setRecords(rows)
        }
      })
      .catch((error: unknown) => console.error('[stories]', error))

    return () => {
      isMounted = false
    }
  }, [])

  const ofKind = (records ?? []).filter((record) => record.kind === kind)

  if (!ofKind.length) {
    return fallback
  }

  return ofKind.filter((record) => record.is_active).map((record) => toStory(record, i18n.language))
}
