import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

type AdminShellLayoutProps = {
  eyebrow: string
  title: string
  description: string
  headerActions?: ReactNode
  hasUnsavedChanges?: boolean
  children: ReactNode
}

const navIconMap = {
  overview: 'space_dashboard',
  magazines: 'menu_book',
  executives: 'groups',
  stats: 'monitoring',
  pages: 'article',
  programs: 'volunteer_activism',
  gallery: 'photo_library',
  transparency: 'verified',
  donations: 'payments',
  campaigns: 'campaign',
  messages: 'mail',
  testimonials: 'forum',
  stories: 'auto_stories',
  settings: 'settings',
} as const

function AdminShellLayout({
  eyebrow,
  title,
  description,
  headerActions,
  hasUnsavedChanges = false,
  children,
}: AdminShellLayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navItems = t('admin.navigation', {
    returnObjects: true,
  }) as Array<{ label: string; href: string; icon: keyof typeof navIconMap }>

  // Warn before a reload, tab close, or external navigation would discard edits.
  useEffect(() => {
    if (!hasUnsavedChanges) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const confirmDiscard = () =>
    !hasUnsavedChanges || window.confirm(t('admin.unsaved.leaveConfirmation'))

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!confirmDiscard()) {
      event.preventDefault()
      return
    }

    setIsMenuOpen(false)
  }

  const isNavItemActive = (href: string) =>
    href === '/admin/dashboard' ? location.pathname === href : location.pathname.startsWith(href)

  const handleSignOut = async () => {
    if (!confirmDiscard()) {
      return
    }

    setIsSigningOut(true)
    await supabase.auth.signOut()
    setIsSigningOut(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#14324d]">
      <div className="sticky top-0 z-30 bg-[#0f2740] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] lg:hidden">
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <div className="min-w-0">
            <p className="truncate font-serif text-[1.45rem] leading-none tracking-[-0.03em]">
              {t('nav.brand')}
            </p>
            <p className="mt-1 truncate text-[0.78rem] text-[#b8cada]">
              {t('admin.dashboard.sidebar.brandNote')}
            </p>
          </div>
          <button
            aria-expanded={isMenuOpen}
            aria-label={t('admin.mobileNav.toggle')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/8 transition hover:bg-white/14"
            onClick={() => setIsMenuOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.35rem]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {isMenuOpen ? (
          <nav className="space-y-1 border-t border-white/10 px-3 pb-4 pt-3">
            {navItems.map((item) => (
              <Link
                className={`flex items-center gap-3 rounded-[0.9rem] px-4 py-3 text-[0.96rem] font-medium transition ${
                  isNavItemActive(item.href)
                    ? 'bg-white/12 text-white'
                    : 'text-[#c2d3de] hover:bg-white/6 hover:text-white'
                }`}
                key={item.href}
                onClick={handleNavClick}
                to={item.href}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
                  {navIconMap[item.icon]}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              className="mt-2 flex w-full items-center gap-3 rounded-[0.9rem] px-4 py-3 text-left text-[0.96rem] font-medium text-[#f3c3c9] transition hover:bg-white/6 disabled:opacity-70"
              disabled={isSigningOut}
              onClick={() => void handleSignOut()}
              type="button"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">logout</span>
              {isSigningOut ? t('admin.dashboard.signingOut') : t('admin.dashboard.signOut')}
            </button>
          </nav>
        ) : null}
      </div>

      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-[#dbe7ee] bg-[#0f2740] px-6 py-8 text-white lg:flex lg:flex-col">
          <div>
            <p className="font-serif text-[2rem] leading-none tracking-[-0.04em] text-white">
              {t('nav.brand')}
            </p>
            <p className="mt-3 text-[0.92rem] leading-[1.7] text-[#b8cada]">
              {t('admin.dashboard.sidebar.brandNote')}
            </p>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.href)

              return (
                <Link
                  className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-[0.96rem] font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-[#c2d3de] hover:bg-white/6 hover:text-white'
                  }`}
                  key={item.href}
                  onClick={handleNavClick}
                  to={item.href}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
                    {navIconMap[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-[1rem] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#9fc2d7]">
                {t('admin.dashboard.dateLabel')}
              </p>
              <p className="mt-2 text-[0.98rem] font-semibold text-white">
                {new Date().toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            <button
              className="w-full rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSigningOut}
              onClick={handleSignOut}
              type="button"
            >
              {isSigningOut
                ? t('admin.dashboard.signingOut')
                : t('admin.dashboard.signOut')}
            </button>

            <div className="rounded-[1.2rem] border border-white/10 bg-white/6 p-5">
              <p className="text-[0.9rem] leading-[1.7] text-[#d8e4eb]">
                {t('admin.dashboard.sidebar.footer')}
              </p>
            </div>
          </div>
        </aside>

        <main className="px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 border-b border-[#dbe7ee] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
                {eyebrow}
              </p>
              <h1 className="mt-4 font-serif text-[2.45rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-[1rem] leading-[1.8] text-[#627581]">
                {description}
              </p>
            </div>

            {headerActions ? (
              <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:min-w-[18rem]">
                {headerActions}
              </div>
            ) : null}
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminShellLayout
