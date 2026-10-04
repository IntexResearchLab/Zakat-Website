import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const siteName = 'Alokayon Charity'
const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://alokayoncharity.com').replace(/\/+$/, '')

type PageInfo = {
  // Reuses the breadcrumb labels so tab titles follow the selected language.
  titleKey?: string
  descriptionKey: string
  noIndex?: boolean
}

const pagesByPath: Record<string, PageInfo> = {
  '/': { descriptionKey: 'seo.descriptions.home' },
  '/about': { titleKey: 'common.breadcrumb.aboutUs', descriptionKey: 'seo.descriptions.about' },
  '/donate': { titleKey: 'common.breadcrumb.donate', descriptionKey: 'seo.descriptions.donate' },
  '/donate/success': {
    titleKey: 'common.breadcrumb.donate',
    descriptionKey: 'seo.descriptions.donate',
    noIndex: true,
  },
  '/donate/failed': {
    titleKey: 'common.breadcrumb.donate',
    descriptionKey: 'seo.descriptions.donate',
    noIndex: true,
  },
  '/donate/cancelled': {
    titleKey: 'common.breadcrumb.donate',
    descriptionKey: 'seo.descriptions.donate',
    noIndex: true,
  },
  '/donate/receipt': {
    titleKey: 'common.breadcrumb.donate',
    descriptionKey: 'seo.descriptions.donate',
    noIndex: true,
  },
  '/gallery': { titleKey: 'common.breadcrumb.gallery', descriptionKey: 'seo.descriptions.gallery' },
  '/opinions-of-beneficiaries': {
    titleKey: 'common.breadcrumb.opinions',
    descriptionKey: 'seo.descriptions.opinions',
  },
  '/our-donors': {
    titleKey: 'common.breadcrumb.donors',
    descriptionKey: 'seo.descriptions.donors',
  },
  '/programs': {
    titleKey: 'common.breadcrumb.programs',
    descriptionKey: 'seo.descriptions.programs',
  },
  '/programs/alokayon-school': {
    titleKey: 'common.breadcrumb.school',
    descriptionKey: 'seo.descriptions.school',
  },
  '/programs/madrasa': {
    titleKey: 'common.breadcrumb.madrasah',
    descriptionKey: 'seo.descriptions.madrasa',
  },
  '/transparency': {
    titleKey: 'common.breadcrumb.transparency',
    descriptionKey: 'seo.descriptions.transparency',
  },
  '/campaigns': {
    titleKey: 'common.breadcrumb.campaigns',
    descriptionKey: 'seo.descriptions.campaigns',
  },
  '/zakat-calculator': {
    titleKey: 'common.breadcrumb.zakatCalculator',
    descriptionKey: 'seo.descriptions.zakatCalculator',
  },
  '/terms-and-conditions': {
    titleKey: 'common.breadcrumb.terms',
    descriptionKey: 'seo.descriptions.terms',
  },
  '/privacy-policy': {
    titleKey: 'common.breadcrumb.privacy',
    descriptionKey: 'seo.descriptions.privacy',
  },
  '/refund-policy': {
    titleKey: 'common.breadcrumb.refund',
    descriptionKey: 'seo.descriptions.refund',
  },
}

const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.content = content
}

const setCanonical = (href: string | null) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!href) {
    element?.remove()
    return
  }

  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }

  element.href = href
}

// Keeps the tab title, search description, canonical address and share tags in step with the
// current page and language. Search engines that run JavaScript read these; link previews in
// apps like WhatsApp only see the defaults in index.html.
function PageTitle() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/'
    const isAdmin = normalizedPath.startsWith('/admin')
    const transparencyYear = normalizedPath.match(/^\/transparency\/([^/]+)$/)?.[1]
    const isCampaignPage = /^\/campaigns\/[^/]+$/.test(normalizedPath)
    const page: PageInfo | null =
      pagesByPath[normalizedPath] ??
      (transparencyYear
        ? {
            titleKey: 'common.breadcrumb.transparency',
            descriptionKey: 'seo.descriptions.transparency',
          }
        : isCampaignPage
          ? { titleKey: 'common.breadcrumb.campaigns', descriptionKey: 'seo.descriptions.campaigns' }
          : null)

    let pageLabel: string | null
    if (isAdmin) {
      pageLabel = 'Admin'
    } else if (!page) {
      pageLabel = t('seo.notFoundTitle')
    } else if (transparencyYear) {
      pageLabel = `${t('common.breadcrumb.transparency')} ${transparencyYear}`
    } else {
      pageLabel = page.titleKey ? t(page.titleKey) : null
    }

    const title = pageLabel ? `${pageLabel} | ${siteName}` : siteName
    const description = t(page?.descriptionKey ?? 'seo.descriptions.home')
    const isIndexable = !isAdmin && Boolean(page) && !page?.noIndex
    const url = `${siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', isIndexable ? 'index, follow' : 'noindex, nofollow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setCanonical(isIndexable ? url : null)
  }, [pathname, t, i18n.language])

  return null
}

export default PageTitle
