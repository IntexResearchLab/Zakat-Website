import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import AdminShellLayout from './AdminShellLayout'

function AdminDashboardShell() {
  const { t } = useTranslation()
  const modules = t('admin.dashboard.modules', {
    returnObjects: true,
  }) as Array<{ title: string; description: string; href: string; cta: string }>
  const nextSteps = t('admin.dashboard.nextSteps', {
    returnObjects: true,
  }) as string[]

  return (
    <AdminShellLayout
      description={t('admin.dashboard.description')}
      eyebrow={t('admin.dashboard.eyebrow')}
      title={t('admin.dashboard.title')}
    >
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <article
            className="rounded-[1.25rem] border border-[#dbe7ee] bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
            key={module.title}
          >
            <h2 className="font-serif text-[1.6rem] leading-[1.02] tracking-[-0.03em] text-[#14324d]">
              {module.title}
            </h2>
            <p className="mt-4 text-[0.94rem] leading-[1.7] text-[#6a7c87]">
              {module.description}
            </p>
            <Link
              className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.16em] text-[#115b82] transition hover:gap-3"
              to={module.href}
            >
              {module.cta}
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8">
        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
            {t('admin.dashboard.nextStepsTitle')}
          </h2>
          <div className="mt-6 space-y-4">
            {nextSteps.map((step) => (
              <div
                className="flex items-start gap-3 rounded-[1rem] border border-[#edf3f7] bg-[#fbfdff] px-4 py-4"
                key={step}
              >
                <span className="material-symbols-outlined mt-0.5 text-[1rem] text-[#2d8a57]">
                  task_alt
                </span>
                <p className="text-[0.96rem] leading-[1.7] text-[#5f7280]">{step}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShellLayout>
  )
}

export default AdminDashboardShell
