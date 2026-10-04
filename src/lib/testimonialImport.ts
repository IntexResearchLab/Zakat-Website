import type { TestimonialKind, TestimonialRecord } from './testimonials'

type Quote = {
  quote: string
  name: string
  role?: string
  location?: string
  title?: string
  category?: string
  tags?: string[]
}

type Locale = {
  opinions: { grid: { cards: Quote[] } }
  donate: { stories: { items: Quote[] }; donorTrust: { items: Quote[] } }
  donors: { cards: { items: Quote[] } }
  home: { voices: { testimonials: Quote[] } }
}

export type ImportRow = Omit<TestimonialRecord, 'id' | 'created_at'>

// Names in the built-in donate stories that are donors, not beneficiaries.
const donorNames = new Set([
  'Md. Abdul Momen',
  'Md. Mohiuddin Babu',
  'Professor Dr. Md. Tohor Ali',
  'Kamrul Hasan',
])

// Turns the quotes currently built into the site (English and Bangla translation files) into
// rows for the testimonials table, so the admin starts from what visitors already see.
// Lists are matched across languages by position, and duplicate people are merged by name.
export const buildImportRows = (en: Locale, bn: Locale): ImportRow[] => {
  const rows = new Map<string, ImportRow>()

  const add = (english: Quote[], bangla: Quote[], kind: TestimonialKind, showOnHome = false) => {
    english.forEach((item, index) => {
      const bnItem = bangla[index]
      const existing = rows.get(item.name)
      const next: ImportRow = {
        kind,
        name: item.name,
        name_bn: bnItem?.name ?? null,
        role_en: item.role ?? null,
        role_bn: bnItem?.role ?? null,
        location_en: item.location ?? null,
        location_bn: bnItem?.location ?? null,
        quote_en: item.quote,
        quote_bn: bnItem?.quote ?? null,
        headline_en: item.title ?? null,
        headline_bn: bnItem?.title ?? null,
        tags_en: item.tags?.join(', ') ?? null,
        tags_bn: bnItem?.tags?.join(', ') ?? null,
        show_on_home: showOnHome,
        is_active: true,
        sort_order: 0,
      }

      // Keep the first position, but fill in details the earlier list didn't have.
      if (!existing) {
        rows.set(item.name, next)
        return
      }

      const merged = { ...existing, show_on_home: existing.show_on_home || showOnHome }
      for (const key of Object.keys(next) as Array<keyof ImportRow>) {
        if (merged[key] === null) {
          Object.assign(merged, { [key]: next[key] })
        }
      }
      rows.set(item.name, merged)
    })
  }

  const isDonor = (item: Quote) => donorNames.has(item.name)
  const pairs = (english: Quote[], bangla: Quote[], keep: (item: Quote) => boolean) => {
    const kept = english
      .map((item, index) => [item, bangla[index]] as const)
      .filter(([item]) => keep(item))
    return [kept.map(([item]) => item), kept.map(([, item]) => item)] as const
  }

  // Beneficiaries: the Donate page's three stories first, then the Voices of Impact cards.
  const [donateStoriesEn, donateStoriesBn] = pairs(
    en.donate.stories.items,
    bn.donate.stories.items,
    (item) => !isDonor(item),
  )
  add(donateStoriesEn, donateStoriesBn, 'beneficiary', true)
  add(en.opinions.grid.cards, bn.opinions.grid.cards, 'beneficiary')
  const homeNames = new Set(en.home.voices.testimonials.map((item) => item.name))
  rows.forEach((row) => {
    if (homeNames.has(row.name)) {
      row.show_on_home = true
    }
  })

  // Donors: the Donate page's donor quotes first, then the Our Donors cards.
  add(en.donate.donorTrust.items, bn.donate.donorTrust.items, 'donor')
  add(en.donors.cards.items, bn.donors.cards.items, 'donor')

  let order = 0
  return [...rows.values()].map((row) => ({ ...row, sort_order: ++order }))
}
