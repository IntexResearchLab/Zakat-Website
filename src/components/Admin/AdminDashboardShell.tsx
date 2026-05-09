import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../../utils/supabase'

function AdminDashboardShell() {
  const { t } = useTranslation()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const stats = t('admin.dashboard.stats', {
    returnObjects: true,
  }) as Array<{ label: string; value: string; context: string }>
  const quickActions = t('admin.dashboard.quickActions', {
    returnObjects: true,
  }) as string[]
  const contentItems = t('admin.dashboard.sections.contentItems', {
    returnObjects: true,
  }) as Array<{ title: string; status: string; meta: string }>
  const donationItems = t('admin.dashboard.sections.donationItems', {
    returnObjects: true,
  }) as Array<{ title: string; value: string; meta: string }>
  const sidebarNav = t('admin.dashboard.sidebar.nav', {
    returnObjects: true,
  }) as string[]

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
            {sidebarNav.map((item, index) => (
              <button
                className={`flex w-full items-center gap-3 rounded-[1rem] px-4 py-3 text-left text-[0.96rem] font-medium transition ${
                  index === 0
                    ? 'bg-white/10 text-white'
                    : 'text-[#c2d3de] hover:bg-white/6 hover:text-white'
                }`}
                key={item}
                type="button"
              >
                <span className="material-symbols-outlined text-[1.1rem]">
                  {index === 0
                    ? 'space_dashboard'
                    : index === 1
                      ? 'article'
                      : index === 2
                        ? 'volunteer_activism'
                        : index === 3
                          ? 'forum'
                          : index === 4
                            ? 'photo_library'
                            : index === 5
                              ? 'verified'
                              : index === 6
                                ? 'payments'
                                : 'settings'}
                </span>
                <span>{item}</span>
              </button>
            ))}
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
                {t('admin.dashboard.eyebrow')}
              </p>
              <h1 className="mt-4 font-serif text-[2.45rem] leading-[0.98] tracking-[-0.04em] text-[#14324d] sm:text-[3rem]">
                {t('admin.dashboard.title')}
              </h1>
              <p className="mt-4 max-w-3xl text-[1rem] leading-[1.8] text-[#627581]">
                {t('admin.dashboard.description')}
              </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:min-w-[18rem]">
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

          <div className="mt-8">
            <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#78909e]">search</span>
                <input
                  className="w-full border-none bg-transparent text-[0.98rem] text-[#14324d] outline-none placeholder:text-[#90a3af]"
                  placeholder={t('admin.dashboard.searchPlaceholder')}
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article
                className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
                key={stat.label}
              >
                <p className="text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                  {stat.label}
                </p>
                <p className="mt-4 font-serif text-[2.4rem] leading-none tracking-[-0.05em] text-[#14324d]">
                  {stat.value}
                </p>
                <p className="mt-3 text-[0.9rem] leading-[1.65] text-[#6a7c87]">
                  {stat.context}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('admin.dashboard.sections.contentTitle')}
              </h2>
              <div className="mt-6 space-y-4">
                {contentItems.map((item) => (
                  <article
                    className="rounded-[1rem] border border-[#edf3f7] bg-[#fbfdff] px-4 py-4"
                    key={item.title}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-[1rem] font-semibold text-[#14324d]">{item.title}</h3>
                        <p className="mt-2 text-[0.9rem] leading-[1.65] text-[#6a7c87]">
                          {item.meta}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full bg-[#edf7fc] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                        {item.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                  {t('admin.dashboard.quickActionsTitle')}
                </h2>
                <div className="mt-6 grid gap-3">
                  {quickActions.map((item) => (
                    <button
                      className="flex items-center justify-between rounded-[1rem] border border-[#dbe7ee] bg-[#fbfdff] px-4 py-4 text-left transition hover:border-[#c6dae7] hover:bg-white"
                      key={item}
                      type="button"
                    >
                      <span className="text-[0.96rem] font-medium text-[#14324d]">{item}</span>
                      <span className="material-symbols-outlined text-[#115b82]">
                        arrow_forward
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                  {t('admin.dashboard.sections.donationsTitle')}
                </h2>
                <div className="mt-6 space-y-4">
                  {donationItems.map((item) => (
                    <article
                      className="rounded-[1rem] border border-[#edf3f7] bg-[#fbfdff] px-4 py-4"
                      key={item.title}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-[1rem] font-semibold text-[#14324d]">{item.title}</h3>
                          <p className="mt-2 text-[0.9rem] leading-[1.65] text-[#6a7c87]">
                            {item.meta}
                          </p>
                        </div>
                        <span className="text-[0.84rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                          {item.value}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboardShell
