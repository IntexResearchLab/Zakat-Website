import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Shown for any address the site doesn't have. Pointing visitors to the most useful pages
// keeps them on the site instead of silently dropping them on the home page.
function NotFound() {
  const { t } = useTranslation()

  const suggestions = [
    { to: '/programs', label: t('notFound.programsLink') },
    { to: '/transparency', label: t('notFound.transparencyLink') },
    { to: '/about', label: t('common.breadcrumb.aboutUs') },
  ]

  return (
    <section className="bg-[radial-gradient(circle_at_top,rgba(225,240,249,0.85),rgba(247,252,255,1)_52%,rgba(255,255,255,1)_100%)] px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-xl rounded-[1.6rem] border border-[#dbe7ee] bg-white p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-10">
        <span
          aria-hidden="true"
          className="material-symbols-outlined mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#eef3f7] text-[2.2rem] text-[#115b82]"
        >
          search
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-[#115b82]">
          {t('notFound.eyebrow')}
        </p>
        <h1 className="mt-3 font-serif text-[2.2rem] leading-[1.05] tracking-[-0.04em] text-[#14324d] sm:text-[2.6rem]">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 text-[1rem] leading-[1.8] text-[#5d6d78]">{t('notFound.message')}</p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#115b82] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#0d4f72]"
            to="/"
          >
            {t('notFound.homeButton')}
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full bg-[#13703e] px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#105f35]"
            to="/donate"
          >
            {t('notFound.donateButton')}
          </Link>
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-[#e4edf3] pt-6 text-[0.94rem]">
          {suggestions.map((item) => (
            <li key={item.to}>
              <Link className="font-semibold text-[#115b82] hover:text-[#0d4f72]" to={item.to}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-7 text-[0.86rem] leading-[1.7] text-[#5d6d78]">
          {t('notFound.contactNote')}{' '}
          <a className="font-semibold text-[#115b82]" href="mailto:alokayon2019@gmail.com">
            alokayon2019@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}

export default NotFound
