import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const siteName = 'Alokayon Charity'

// Reuses the breadcrumb labels so tab titles follow the selected language.
const titleKeysByPath: Record<string, string> = {
  '/about': 'common.breadcrumb.aboutUs',
  '/donate': 'common.breadcrumb.donate',
  '/donate/success': 'common.breadcrumb.donate',
  '/donate/failed': 'common.breadcrumb.donate',
  '/donate/cancelled': 'common.breadcrumb.donate',
  '/donate/receipt': 'common.breadcrumb.donate',
  '/gallery': 'common.breadcrumb.gallery',
  '/opinions-of-beneficiaries': 'common.breadcrumb.opinions',
  '/our-donors': 'common.breadcrumb.donors',
  '/programs': 'common.breadcrumb.programs',
  '/programs/alokayon-school': 'common.breadcrumb.school',
  '/programs/madrasa': 'common.breadcrumb.madrasah',
  '/transparency': 'common.breadcrumb.transparency',
  '/terms-and-conditions': 'common.breadcrumb.terms',
  '/privacy-policy': 'common.breadcrumb.privacy',
  '/refund-policy': 'common.breadcrumb.refund',
}

function PageTitle() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/'
    let pageLabel: string | null = null

    if (normalizedPath.startsWith('/admin')) {
      pageLabel = 'Admin'
    } else if (titleKeysByPath[normalizedPath]) {
      pageLabel = t(titleKeysByPath[normalizedPath])
    } else if (normalizedPath.startsWith('/transparency/')) {
      const year = normalizedPath.split('/')[2]
      pageLabel = `${t('common.breadcrumb.transparency')} ${year}`
    }

    document.title = pageLabel ? `${pageLabel} | ${siteName}` : siteName
  }, [pathname, t, i18n.language])

  return null
}

export default PageTitle
