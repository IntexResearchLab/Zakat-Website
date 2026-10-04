import type { ServerResponse } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getServiceClient } from './_lib/db.js'
import { getSiteUrl, type ApiRequest } from './_lib/sslcommerz.js'

// Serves an appeal's page with its own title, summary and photo in the <head>, so a shared link
// shows that appeal on WhatsApp or Facebook. The page then loads like any other page of the site.
// vercel.json rewrites /campaigns/:slug here. Fixed pages get the same treatment at build time
// in scripts/prerender-meta.mjs.

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

export default async function handler(req: ApiRequest, res: ServerResponse) {
  const slug = new URL(req.url ?? '', 'http://localhost').searchParams.get('slug') ?? ''
  const siteUrl = getSiteUrl(req)
  let html: string

  try {
    html = await loadShell()
  } catch (error) {
    console.error('[campaign-page] could not load the page shell', error)
    res.statusCode = 302
    res.setHeader('Location', '/campaigns')
    return res.end()
  }

  let status = 200

  try {
    const { data } = /^[a-z0-9-]{1,80}$/.test(slug)
      ? await getServiceClient()
          .from('campaigns')
          .select('slug, title_en, summary_en, image_url, is_active, starts_on')
          .eq('slug', slug)
          .maybeSingle()
      : { data: null }

    // Hidden and not-yet-started appeals are not public: the app shows its "not found" page.
    if (!data || !data.is_active || (data.starts_on && data.starts_on > todayInDhaka())) {
      status = 404
    } else {
      const title = escapeAttribute(`${data.title_en} | ${siteName}`)
      const description = escapeAttribute(data.summary_en)
      const url = escapeAttribute(`${siteUrl}/campaigns/${data.slug}`)

      html = html
        .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
        .replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
          `<meta name="description" content="${description}" />`,
        )
        .replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:title" content="${title}" />`,
        )
        .replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:description" content="${description}" />`,
        )
        .replace(
          /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
          `<meta property="og:url" content="${url}" />`,
        )
        .replace(
          /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
          `<link rel="canonical" href="${url}" />`,
        )

      if (data.image_url) {
        // The campaign photo has its own size and subject, so the default image's details no longer apply.
        html = html
          .replace(
            /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:image" content="${escapeAttribute(data.image_url)}" />`,
          )
          .replace(/\s*<meta\s+property="og:image:(?:width|height)"\s+content="[^"]*"\s*\/?>/g, '')
          .replace(
            /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
            `<meta property="og:image:alt" content="${escapeAttribute(data.title_en)}" />`,
          )
      }
    }
  } catch (error) {
    // Without the database the page still works; it just keeps the general preview.
    console.error('[campaign-page]', error)
  }

  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Short shared cache: edits to an appeal show up in new previews within a few minutes.
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600')
  res.end(html)
}
