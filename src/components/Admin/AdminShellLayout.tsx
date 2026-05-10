import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { supabase } from '../../utils/supabase'

type AdminShellLayoutProps = {
  eyebrow: string
  title: string
  description: string
  headerActions?: ReactNode
  children: ReactNode
}

const navIconMap = {
  overview: 'space_dashboard',
  magazines: 'menu_book',
  executives: 'groups',
  stats: 'monitoring',
  pages: 'article',
  programs: 'volunteer_activism',
  stories: 'forum',
  gallery: 'photo_library',
  transparency: 'verified',
  donations: 'payments',
  settings: 'settings',
} as const

function AdminShellLayout({
  eyebrow,
  title,
  description,
  headerActions,
  children,
}: AdminShellLayoutProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navItems = t('admin.navigation', {
    returnObjects: true,
  }) as Array<{ label: string; href: string; icon: keyof typeof navIconMap }>

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    setIsSigningOut(false)
  }

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#14324d]">
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
              const isActive =
                item.href === '/admin/dashboard'
                  ? location.pathname === item.href
                  : location.pathname.startsWith(item.href)

              return (
                <Link
                  className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-[0.96rem] font-medium transition ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-[#c2d3de] hover:bg-white/6 hover:text-white'
                  }`}
                  key={item.href}
                  to={item.href}
                >
                  <span className="material-symbols-outlined text-[1.1rem]">
                    {navIconMap[item.icon]}
                  </span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-[1.2rem] border border-white/10 bg-white/6 p-5">
            <p className="text-[0.9rem] leading-[1.7] text-[#d8e4eb]">
              {t('admin.dashboard.sidebar.footer')}
            </p>
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

            <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:min-w-[18rem]">
              {headerActions}
              <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {t('admin.dashboard.dateLabel')}
                </p>
                <p className="mt-2 text-[0.98rem] font-semibold text-[#14324d]">
                  {new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <button
                className="rounded-full border border-[#dbe7ee] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#14324d] shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition hover:border-[#c2d7e6] hover:bg-[#f9fcfe] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSigningOut}
                onClick={handleSignOut}
                type="button"
              >
                {isSigningOut
                  ? t('admin.dashboard.signingOut')
                  : t('admin.dashboard.signOut')}
              </button>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminShellLayout
