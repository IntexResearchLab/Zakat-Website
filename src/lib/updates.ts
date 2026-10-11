import { supabase } from './supabase'

export const updatesBucket = 'updates'

export const maxUpdatePhotos = 6

// Same categories as the gallery, so labels come from galleryPage.filters.
export const updatePrograms = [
  'education',
  'relief',
  'livelihood',
  'healthcare',
  'madrasa',
  'pathshala',
] as const

export type UpdateProgram = (typeof updatePrograms)[number]

export type UpdateRecord = {
  id: string
  slug: string
  title_en: string
  title_bn: string | null
  body_en: string
  body_bn: string | null
  published_on: string
  program: UpdateProgram | null
  photos: string[]
  youtube_url: string | null
  is_published: boolean
  created_at: string
}

let updatesCache: UpdateRecord[] | null = null

export const getCachedUpdates = () => updatesCache

export const invalidateUpdatesCache = () => {
  updatesCache = null
}

let inFlight: Promise<UpdateRecord[]> | null = null

// Posts, newest first. Sections that ask at the same time share one request.
// Visitors only receive published posts; signed-in admins receive hidden ones too, so public
// pages still filter on is_published.
export const loadUpdates = () => {
  inFlight ??= fetchUpdates().finally(() => {
    inFlight = null
  })
  return inFlight
}

const fetchUpdates = async () => {
  const { data, error } = await supabase
    .from('updates')
    .select('*')
    .order('published_on', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  updatesCache = ((data ?? []) as UpdateRecord[]).map((update) => ({
    ...update,
    photos: update.photos ?? [],
  }))

  return updatesCache
}

// Bangla text when the visitor reads in Bangla and it has been written; English otherwise.
export const localizedUpdateText = (
  update: UpdateRecord,
  field: 'title' | 'body',
  language: string,
) => {
  const bangla = update[`${field}_bn`]
  return (language === 'bn' && bangla?.trim() ? bangla : update[`${field}_en`]) ?? ''
}

// A date-only value read at midday, so no time zone can move it to the day before.
export const updateDate = (update: UpdateRecord) => `${update.published_on}T12:00:00`

export const todayInDhaka = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })

export const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')

// Paragraphs are separated by a blank line, as admins type them.
export const splitParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const youTubeIdPattern = /^[A-Za-z0-9_-]{11}$/
const youTubeHosts = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]

// The video id from a YouTube link: watch?v=, youtu.be/, shorts/ and embed/ links.
// Anything else (playlists, channels, other sites) returns null.
export const getYouTubeId = (link: string) => {
  const trimmed = link.trim()
  let url: URL

  try {
    // Links copied from an address bar sometimes lose their "https://".
    url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    return null
  }

  const host = url.hostname.toLowerCase()
  const segments = url.pathname.split('/').filter(Boolean)
  let id: string | null = null

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    id = segments.length === 1 ? segments[0] : null
  } else if (youTubeHosts.includes(host)) {
    if (segments.length === 1 && segments[0] === 'watch') {
      id = url.searchParams.get('v')
    } else if (segments.length === 2 && (segments[0] === 'shorts' || segments[0] === 'embed')) {
      id = segments[1]
    }
  }

  return id && youTubeIdPattern.test(id) ? id : null
}

// Stored form of a video link, so every saved link has the same shape.
export const getYouTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

// Privacy-enhanced player: YouTube sets no cookies until the visitor presses play.
export const getYouTubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`

export const getUpdatePhotoPath = (publicUrl: string) => {
  const marker = `/storage/v1/object/public/${updatesBucket}/`
  const index = publicUrl.indexOf(marker)
  return index === -1 ? null : publicUrl.slice(index + marker.length)
}
