import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getFriendlyErrorMessage } from '../../lib/adminErrors'
import { supabase } from '../../utils/supabase'
import AdminShellLayout from './AdminShellLayout'

type ModuleKey = 'magazines' | 'gallery' | 'executives' | 'stats'

type ModuleSummary = {
  total: number
  hidden?: number
  lastDate?: string | null
  latestYear?: number | null
  missingPhotos?: number
  ageInDays?: number | null
}

type DashboardData = Partial<Record<ModuleKey, ModuleSummary>>

type Alert = {
  tone: 'warning' | 'error'
  message: string
  href: string
}

const moduleKeyByHref: Record<string, ModuleKey> = {
  '/admin/magazines': 'magazines',
  '/admin/gallery': 'gallery',
  '/admin/executives': 'executives',
  '/admin/stats': 'stats',
}

const publicHrefByModule: Record<ModuleKey, string> = {
  magazines: '/transparency',
  gallery: '/gallery',
  executives: '/about#executive-committee',
  stats: '/',
}

const staleStatsDays = 180

const latestDate = (values: Array<string | null | undefined>) =>
  values.filter(Boolean).sort().at(-1) ?? null

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

const loadDashboardData = async () => {
  const [magazines, gallery, executives, stats] = await Promise.all([
    supabase.from('magazines').select('id, year, created_at'),
    supabase.from('gallery_items').select('id, is_active, created_at'),
    supabase.from('executive_members').select('id, is_active, image_url, created_at'),
    supabase.from('public_stats').select('id, updated_at'),
  ])

  const data: DashboardData = {}
  const errors: Partial<Record<ModuleKey, unknown>> = {}

  if (magazines.error) {
    errors.magazines = magazines.error
  } else {
    const rows = magazines.data ?? []
    data.magazines = {
      total: rows.length,
      lastDate: latestDate(rows.map((row) => row.created_at)),
      latestYear: rows.length ? Math.max(...rows.map((row) => Number(row.year))) : null,
    }
  }

  if (gallery.error) {
    errors.gallery = gallery.error
  } else {
    const rows = gallery.data ?? []
    data.gallery = {
      total: rows.length,
      hidden: rows.filter((row) => !row.is_active).length,
      lastDate: latestDate(rows.map((row) => row.created_at)),
    }
  }

  if (executives.error) {
    errors.executives = executives.error
  } else {
    const rows = executives.data ?? []
    data.executives = {
      total: rows.length,
      hidden: rows.filter((row) => !row.is_active).length,
      lastDate: latestDate(rows.map((row) => row.created_at)),
      missingPhotos: rows.filter((row) => row.is_active && !row.image_url).length,
    }
  }

  if (stats.error) {
    errors.stats = stats.error
  } else {
    const rows = stats.data ?? []
    const lastDate = latestDate(rows.map((row) => row.updated_at))
    data.stats = {
      total: rows.length,
      lastDate,
      ageInDays: lastDate ? (Date.now() - new Date(lastDate).getTime()) / 86_400_000 : null,
    }
  }

  return { data, errors }
}

function AdminDashboardShell() {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DashboardData>({})
  const [loadError, setLoadError] = useState<{ moduleKey: ModuleKey; message: string } | null>(null)
  const modules = t('admin.dashboard.modules', {
    returnObjects: true,
  }) as Array<{ title: string; description: string; href: string; cta: string }>

  useEffect(() => {
    let isMounted = true

    void loadDashboardData().then((result) => {
      if (!isMounted) {
        return
      }

      const failedModule = (Object.keys(result.errors) as ModuleKey[])[0]
      setData(result.data)
      setLoadError(
        failedModule
          ? {
              moduleKey: failedModule,
              message: getFriendlyErrorMessage(t, result.errors[failedModule] as { message?: string }),
            }
          : null,
      )
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [t])

  const alerts: Alert[] = []
  const currentYear = new Date().getFullYear()

  if (loadError) {
    alerts.push({
      tone: 'error',
      message: t('admin.dashboard.alerts.loadError', { reason: loadError.message }),
      href: `/admin/${loadError.moduleKey}`,
    })
  }

  if (data.magazines) {
    if (!data.magazines.total) {
      alerts.push({ tone: 'warning', message: t('admin.dashboard.alerts.noMagazines'), href: '/admin/magazines' })
    } else if (data.magazines.latestYear && data.magazines.latestYear < currentYear - 1) {
      alerts.push({
        tone: 'warning',
        message: t('admin.dashboard.alerts.oldMagazine', { year: data.magazines.latestYear }),
        href: '/admin/magazines',
      })
    }
  }

  if (data.gallery && data.gallery.total - (data.gallery.hidden ?? 0) === 0) {
    alerts.push({ tone: 'warning', message: t('admin.dashboard.alerts.noVisibleGallery'), href: '/admin/gallery' })
  }

  if (data.executives) {
    if (data.executives.total - (data.executives.hidden ?? 0) === 0) {
      alerts.push({ tone: 'warning', message: t('admin.dashboard.alerts.noVisibleExecutives'), href: '/admin/executives' })
    }

    if (data.executives.missingPhotos) {
      alerts.push({
        tone: 'warning',
        message: t('admin.dashboard.alerts.missingPhotos', { count: data.executives.missingPhotos }),
        href: '/admin/executives',
      })
    }
  }

  if (data.stats) {
    const { lastDate: lastUpdated, ageInDays } = data.stats

    if (!lastUpdated || ageInDays == null) {
      alerts.push({ tone: 'warning', message: t('admin.dashboard.alerts.statsNeverUpdated'), href: '/admin/stats' })
    } else if (ageInDays > staleStatsDays) {
      alerts.push({
        tone: 'warning',
        message: t('admin.dashboard.alerts.staleStats', { date: formatDate(lastUpdated) }),
        href: '/admin/stats',
      })
    }
  }

  const renderSummary = (moduleKey: ModuleKey) => {
    if (isLoading) {
      return <p className="text-[0.9rem] text-[#5d6d78]">{t('admin.dashboard.loading')}</p>
    }

    const summary = data[moduleKey]

    if (!summary) {
      return <p className="text-[0.9rem] text-[#a33b49]">{t('admin.dashboard.summary.unavailable')}</p>
    }

    return (
      <div>
        <p className="flex items-baseline gap-2">
          <span className="font-serif text-[2.4rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {summary.total}
          </span>
          <span className="text-[0.9rem] text-[#5d6d78]">{t(`admin.dashboard.units.${moduleKey}`)}</span>
        </p>
        <div className="mt-3 space-y-1 text-[0.86rem] leading-[1.5] text-[#5d6d78]">
          {summary.hidden ? <p>{t('admin.dashboard.summary.hidden', { count: summary.hidden })}</p> : null}
          {moduleKey === 'magazines' && summary.latestYear ? (
            <p>{t('admin.dashboard.summary.latestIssue', { year: summary.latestYear })}</p>
          ) : null}
          <p>
            {summary.lastDate
              ? t(
                  moduleKey === 'stats'
                    ? 'admin.dashboard.summary.lastUpdated'
                    : 'admin.dashboard.summary.lastAdded',
                  { date: formatDate(summary.lastDate) },
                )
              : t('admin.dashboard.summary.never')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdminShellLayout
      description={t('admin.dashboard.description')}
      eyebrow={t('admin.dashboard.eyebrow')}
      title={t('admin.dashboard.title')}
    >
      <section className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
          {t('admin.dashboard.attentionTitle')}
        </h2>
        <div className="mt-5 space-y-3">
          {isLoading ? (
            <p className="text-[0.95rem] text-[#5d6d78]">{t('admin.dashboard.loading')}</p>
          ) : alerts.length ? (
            alerts.map((alert) => (
              <Link
                className={`flex items-start gap-3 rounded-[1rem] border px-4 py-3.5 transition hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] ${
                  alert.tone === 'error'
                    ? 'border-[#f3d1d4] bg-[#fff6f7] text-[#9e3342]'
                    : 'border-[#f1dfb5] bg-[#fffaf0] text-[#7a5a14]'
                }`}
                key={alert.message}
                to={alert.href}
              >
                <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[1.1rem]">
                  {alert.tone === 'error' ? 'error' : 'warning'}
                </span>
                <span className="flex-1 text-[0.95rem] leading-[1.6]">{alert.message}</span>
                <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-[1rem]">arrow_forward</span>
              </Link>
            ))
          ) : (
            <p className="flex items-center gap-3 rounded-[1rem] border border-[#cde7d8] bg-[#f5fbf7] px-4 py-3.5 text-[0.95rem] text-[#13703e]">
              <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">task_alt</span>
              {t('admin.dashboard.allGood')}
            </p>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {modules.map((module) => {
          const moduleKey = moduleKeyByHref[module.href]

          return (
            <article
              className="flex flex-col rounded-[1.25rem] border border-[#dbe7ee] bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              key={module.title}
            >
              <h2 className="font-serif text-[1.6rem] leading-[1.02] tracking-[-0.03em] text-[#14324d]">
                {module.title}
              </h2>
              <p className="mt-3 text-[0.92rem] leading-[1.65] text-[#5d6d78]">{module.description}</p>
              <div className="mt-5 flex-1 border-t border-[#edf3f7] pt-5">
                {moduleKey ? renderSummary(moduleKey) : null}
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Link
                  className="inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:gap-3"
                  to={module.href}
                >
                  {module.cta}
                  <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">arrow_forward</span>
                </Link>
                {moduleKey ? (
                  <a
                    className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-[#5d6d78] transition hover:text-[#115b82]"
                    href={publicHrefByModule[moduleKey]}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('admin.list.viewOnSite')}
                    <span aria-hidden="true" className="material-symbols-outlined text-[0.95rem]">open_in_new</span>
                  </a>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </AdminShellLayout>
  )
}

export default AdminDashboardShell
