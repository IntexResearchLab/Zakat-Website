import type { StoryRecord } from './stories'

type FeaturedStory = {
  title: string
  badges: string[]
  summary: string
  summaryTwo: string
  fullStory: string[]
}

type DonorStory = {
  title: string
  summary: string
  paragraphs: string[]
  name: string
  role: string
}

type Locale = {
  opinions: { featuredStory: FeaturedStory }
  donors: { stories: { items: DonorStory[] } }
}

export type StoryImportRow = Omit<StoryRecord, 'id' | 'created_at'>

// Photos used by the built-in stories today, so imported stories keep them.
export const builtInFeaturedImage = '/assets/about/beneficiary-story.webp'
export const builtInDonorPortraits: Record<number, string> = {
  2: '/assets/about/affan-abbasi.webp',
}

const paragraphs = (items: string[] | undefined) => (items?.length ? items.join('\n\n') : null)

// Turns the stories currently built into the site (English and Bangla translation files) into rows
// for the stories table, so the admin starts from what visitors already see.
export const buildStoryImportRows = (en: Locale, bn: Locale): StoryImportRow[] => {
  const featuredEn = en.opinions.featuredStory
  const featuredBn = bn.opinions.featuredStory

  const featured: StoryImportRow = {
    kind: 'beneficiary',
    title_en: featuredEn.title,
    title_bn: featuredBn?.title ?? null,
    summary_en: [featuredEn.summary, featuredEn.summaryTwo].filter(Boolean).join('\n\n'),
    summary_bn: paragraphs(
      [featuredBn?.summary, featuredBn?.summaryTwo].filter(Boolean) as string[],
    ),
    body_en: paragraphs(featuredEn.fullStory),
    body_bn: paragraphs(featuredBn?.fullStory),
    name: null,
    name_bn: null,
    role_en: null,
    role_bn: null,
    badges_en: featuredEn.badges.join(', '),
    badges_bn: featuredBn?.badges?.join(', ') ?? null,
    image_url: builtInFeaturedImage,
    is_active: true,
    sort_order: 1,
  }

  const donors = en.donors.stories.items.map<StoryImportRow>((story, index) => {
    const bangla = bn.donors.stories.items[index]
    return {
      kind: 'donor',
      title_en: story.title,
      title_bn: bangla?.title ?? null,
      summary_en: story.summary,
      summary_bn: bangla?.summary ?? null,
      body_en: paragraphs(story.paragraphs),
      body_bn: paragraphs(bangla?.paragraphs),
      name: story.name,
      name_bn: bangla?.name ?? null,
      role_en: story.role,
      role_bn: bangla?.role ?? null,
      badges_en: null,
      badges_bn: null,
      image_url: builtInDonorPortraits[index] ?? null,
      is_active: true,
      sort_order: index + 2,
    }
  })

  return [featured, ...donors]
}
