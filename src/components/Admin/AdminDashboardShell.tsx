import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import AdminShellLayout from './AdminShellLayout'

function AdminDashboardShell() {
  const { t } = useTranslation()
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

  return (
    <AdminShellLayout
      description={t('admin.dashboard.description')}
      eyebrow={t('admin.dashboard.eyebrow')}
      title={t('admin.dashboard.title')}
    >
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
                  {quickActions.map((item, index) => {
                    const isMagazineAction = index === 1

                    if (isMagazineAction) {
                      return (
                        <Link
                          className="flex items-center justify-between rounded-[1rem] border border-[#dbe7ee] bg-[#fbfdff] px-4 py-4 text-left transition hover:border-[#c6dae7] hover:bg-white"
                          key={item}
                          to="/admin/magazines"
                        >
                          <span className="text-[0.96rem] font-medium text-[#14324d]">{item}</span>
                          <span className="material-symbols-outlined text-[#115b82]">
                            arrow_forward
                          </span>
                        </Link>
                      )
                    }

                    return (
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
                    )
                  })}
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
    </AdminShellLayout>
  )
}

export default AdminDashboardShell
