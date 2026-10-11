import type { ServerResponse } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getServiceClient } from './_lib/db.js'
import { getSiteUrl, type ApiRequest } from './_lib/sslcommerz.js'

// Serves an appeal's or a news post's page with its own title, summary and photo in the <head>,
// so a shared link shows that appeal or post on WhatsApp or Facebook. The page then loads like any
// other page of the site. vercel.json rewrites /campaigns/:slug here, and /updates/:slug with
// type=update (one function for both, because the hosting plan limits the number of functions).
// Fixed pages get the same treatment at build time in scripts/prerender-meta.mjs.

const siteName = 'Alokayon Charity'

const escapeAttribute = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const loadShell = async () => {
  // Bundled with this function by vercel.json ("includeFiles"); fetched as a fallback.
  try {
    return await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8')
  } catch {
    const host = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
    const response = await fetch(`${host}/`)
    return response.text()
  }
}

const todayInDhaka = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' })

// What a link preview shows. null when the page is not public.
type Preview = {
  title: string
  description: string
  path: string
  imageUrl: string | null
  imageAlt: string
}

const loadCampaignPreview = async (slug: string): Promise<Preview | null> => {
  const { data } = await getServiceClient()
    .from('campaigns')
    .select('slug, title_en, summary_en, image_url, is_active, starts_on')
    .eq('slug', slug)
    .maybeSingle()

  // Hidden and not-yet-started appeals are not public: the app shows its "not found" page.
  if (!data || !data.is_active || (data.starts_on && data.starts_on > todayInDhaka())) {
    return null
  }

  return {
    title: data.title_en,
    description: data.summary_en ?? '',
    path: `/campaigns/${data.slug}`,
    imageUrl: data.image_url,
    imageAlt: data.title_en,
  }
}

// Previews show roughly two lines, so a long post is cut at a word boundary.
const shortDescription = (text: string, limit = 200) => {
  const flat = text.replace(/\s+/g, ' ').trim()
  if (flat.length <= limit) {
    return flat
  }
  const cut = flat.slice(0, limit)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

const loadUpdatePreview = async (slug: string): Promise<Preview | null> => {
  const { data } = await getServiceClient()
    .from('updates')
    .select('slug, title_en, body_en, photos, is_published')
    .eq('slug', slug)
    .maybeSingle()

  // Hidden posts are not public: the app shows its "not found" page.
  if (!data || !data.is_published) {
    return null
  }

  return {
    title: data.title_en,
    description: shortDescription(data.body_en ?? ''),
    path: `/updates/${data.slug}`,
    imageUrl: data.photos?.[0] ?? null,
    imageAlt: data.title_en,
  }
}

export default async function handler(req: ApiRequest, res: ServerResponse) {
  const params = new URL(req.url ?? '', 'http://localhost').searchParams
  const slug = params.get('slug') ?? ''
  const isUpdate = params.get('type') === 'update'
  const siteUrl = getSiteUrl(req)
  let html: string

  try {
    html = await loadShell()
  } catch (error) {
    console.error('[campaign-page] could not load the page shell', error)
    res.statusCode = 302
    res.setHeader('Location', isUpdate ? '/updates' : '/campaigns')
    return res.end()
  }

  let status = 200

  try {
    const data = /^[a-z0-9-]{1,80}$/.test(slug)
      ? await (isUpdate ? loadUpdatePreview(slug) : loadCampaignPreview(slug))
      : null

    if (!data) {
      status = 404
    } else {
      const title = escapeAttribute(`${data.title} | ${siteName}`)
      const description = escapeAttribute(data.description)
      const url = escapeAttribute(`${siteUrl}${data.path}`)

      html = html
        // Function replacements, so a "$" in the text is not read as a replacement pattern.
        .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
          () => `<meta name="description" content="${description}" />`,
        )
        .replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
          () => `<meta property="og:title" content="${title}" />`,
        )
        .replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
          () => `<meta property="og:description" content="${description}" />`,
        )
        .replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
          () => `<meta property="og:url" content="${url}" />`,
        )
        .replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
          () => `<link rel="canonical" href="${url}" />`,
        )

      const { imageUrl, imageAlt } = data
      if (imageUrl) {
        // The page's own photo has its own size and subject, so the default image's details no longer apply.
        html = html
          .replace(
            /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
            () => `<meta property="og:image" content="${escapeAttribute(imageUrl)}" />`,
          )
          .replace(/\s*<meta\s+property="og:image:(?:width|height)"\s+content="[^"]*"\s*\/?>/g, '')
          .replace(
            /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
            () => `<meta property="og:image:alt" content="${escapeAttribute(imageAlt)}" />`,
          )
      }
    }
  } catch (error) {
    // Without the database the page still works; it just keeps the general preview.
    console.error('[campaign-page]', error)
  }

  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Short shared cache: edits to an appeal or post show up in new previews within a few minutes.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600')
  res.end(html)
}
