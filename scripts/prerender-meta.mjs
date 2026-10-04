// Writes one HTML file per public page (dist/donate.html, dist/programs/madrasa.html, ...) with
// that page's title, description and address already in the <head>. Apps such as WhatsApp and
// Facebook don't run JavaScript, so without this every shared link shows the home page preview.
// The page itself still loads and renders exactly as before.
//
// Runs after `vite build`. vercel.json's "cleanUrls" serves /donate from dist/donate.html.
// The same tag replacement for campaign pages happens at request time in api/campaign-page.ts.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const root = join(dirname(new URL(import.meta.url).pathname), '..')
const dist = join(root, 'dist')
const siteName = 'Alokayon Charity'
const siteUrl = (process.env.VITE_SITE_URL || 'https://alokayoncharity.com').replace(/\/+$/, '')

const shell = readFileSync(join(dist, 'index.html'), 'utf8')
const pages = JSON.parse(readFileSync(join(root, 'src/content/pageMeta.json'), 'utf8'))
const en = JSON.parse(readFileSync(join(root, 'src/locales/en/common.json'), 'utf8'))

const lookup = (key) => key.split('.').reduce((value, part) => value?.[part], en)

const escapeAttribute = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Each pattern must match exactly once, so a change to index.html can't silently break previews.
const replaceOnce = (html, pattern, replacement, label) => {
  const matches = html.match(new RegExp(pattern.source, 'g')) ?? []
  if (matches.length !== 1) {
    throw new Error(`prerender-meta: expected one ${label} in dist/index.html, found ${matches.length}`)
  }
  return html.replace(pattern, replacement)
}

const withMeta = (html, { title, description, url }) => {
  const t = escapeAttribute(title)
  const d = escapeAttribute(description)
  const u = escapeAttribute(url)
  let out = html
  out = replaceOnce(out, /<title>[^<]*<\/title>/, `<title>${t}</title>`, '<title>')
  out = replaceOnce(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${d}" />`, 'description')
  out = replaceOnce(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${t}" />`, 'og:title')
  out = replaceOnce(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${d}" />`, 'og:description')
  out = replaceOnce(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${u}" />`, 'og:url')
  out = replaceOnce(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${u}" />`, 'canonical')
  return out
}

let written = 0
for (const [path, info] of Object.entries(pages)) {
  // The home page is index.html itself; pages kept out of search don't need previews.
  if (path === '/' || info.noIndex) {
    continue
  }

  const label = info.titleKey ? lookup(info.titleKey) : null
  const description = lookup(info.descriptionKey)
  if (typeof description !== 'string') {
    throw new Error(`prerender-meta: missing English text for ${info.descriptionKey}`)
  }

  const html = withMeta(shell, {
    title: label ? `${label} | ${siteName}` : siteName,
    description,
    url: `${siteUrl}${path}`,
  })

  const file = join(dist, `${path.slice(1)}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  written += 1
}

console.log(`prerender-meta: wrote ${written} pages`)
