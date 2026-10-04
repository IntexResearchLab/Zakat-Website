import { useEffect, useId, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

type DesktopDropdownProps = {
  label: string
  isActive: boolean
  items: Array<{ label: string; to: string }>
}

function DesktopDropdown({ label, isActive, items }: DesktopDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  // Opens on hover, click, or keyboard; closes on Escape or when focus leaves the menu.
  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false)
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && isOpen) {
          setIsOpen(false)
          event.currentTarget.querySelector('button')?.focus()
        }
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        className={`flex items-center gap-1.5 border-b-[3px] pb-2 text-[0.98rem] font-medium transition ${
          isActive
            ? 'border-[#115b82] text-[#115b82]'
            : 'border-transparent text-[#587189] hover:text-[#115b82]'
        }`}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        <span>{label}</span>
        <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
          expand_more
        </span>
      </button>

      <div
        className={`absolute left-1/2 top-full z-30 w-60 -translate-x-1/2 pt-2 transition duration-150 ${
          isOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        id={menuId}
      >
        <div className="rounded-[1.15rem] border border-[#d8e5ec] bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.1)]">
          <div className="grid gap-1.5">
            {items.map((item) => (
              <NavLink
                className={({ isActive: itemActive }) =>
                  itemActive
                    ? 'rounded-xl bg-[#eef7fb] px-4 py-3 text-[0.94rem] font-semibold text-[#115b82]'
                    : 'rounded-xl px-4 py-3 text-[0.94rem] font-medium text-[#587189] transition hover:bg-[#f4fafc] hover:text-[#115b82]'
                }
                key={item.to}
                onClick={() => setIsOpen(false)}
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()

  const programItems = useMemo(
    () => [
      { label: t('nav.programsOverview'), to: '/programs' },
      { label: t('nav.school'), to: '/programs/alokayon-school' },
      { label: t('nav.madrasah'), to: '/programs/madrasa' },
    ],
    [t],
  )

  const impactItems = useMemo(
    () => [
      { label: t('nav.voices'), to: '/opinions-of-beneficiaries' },
      { label: t('nav.donors'), to: '/our-donors' },
    ],
    [t],
  )

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'border-b-[3px] border-[#115b82] pb-2 text-[0.98rem] font-semibold text-[#115b82]'
      : 'border-b-[3px] border-transparent pb-2 text-[0.98rem] font-medium text-[#587189] transition hover:text-[#115b82]'

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'rounded-xl bg-[#eef7fb] px-4 py-3 text-[1rem] font-semibold text-[#115b82]'
      : 'rounded-xl px-4 py-3 text-[1rem] font-medium text-[#587189]'

  // Close the mobile menu with Escape. Its links close it themselves when clicked.
  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const programsActive = location.pathname.startsWith('/programs')
  const impactActive =
    location.pathname === '/opinions-of-beneficiaries' || location.pathname === '/our-donors'

  return (
    <header className="sticky top-0 z-40 border-b border-[#c5d8e5] bg-[rgba(247,252,255,0.88)] px-4 py-3 backdrop-blur-xl shadow-[0_6px_24px_rgba(15,23,42,0.04)] sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
        <NavLink
          className="flex min-w-0 shrink items-center gap-3 font-serif text-[1.2rem] font-semibold leading-none tracking-[-0.03em] text-[#115b82] sm:text-[1.75rem]"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          <img
            alt={t('nav.brand')}
            className="h-10 w-10 shrink-0 rounded-full border border-[#d5e5ef] bg-white object-contain p-1 shadow-[0_6px_18px_rgba(15,23,42,0.08)] sm:h-11 sm:w-11"
            decoding="async"
            src="/assets/about/Logo.webp"
          />
          <span className="max-w-[8.5rem] truncate sm:max-w-none">{t('nav.brand')}</span>
        </NavLink>

        <nav
          aria-label={t('common.aria.mainNavigation')}
          className="hidden items-center gap-6 whitespace-nowrap xl:flex 2xl:gap-9"
        >
          <NavLink className={linkClass} to="/">
            {t('nav.home')}
          </NavLink>
          <NavLink className={linkClass} to="/about">
            {t('nav.about')}
          </NavLink>
          <NavLink className={linkClass} to="/gallery">
            {t('nav.gallery')}
          </NavLink>
          <DesktopDropdown
            isActive={programsActive}
            items={programItems}
            label={t('nav.programs')}
          />
          <DesktopDropdown isActive={impactActive} items={impactItems} label={t('nav.impact')} />
          <NavLink className={linkClass} to="/zakat-calculator">
            {t('nav.zakatCalculator')}
          </NavLink>
          <NavLink className={linkClass} to="/transparency">
            {t('nav.transparency')}
          </NavLink>
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden xl:block">
            <LanguageSwitcher />
          </div>

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={t('common.aria.toggleNavigationMenu')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cfe0ea] bg-white text-[#115b82] transition hover:bg-[#eef7fb] xl:hidden"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.35rem]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <NavLink
            className="rounded-full bg-[#13703e] px-5 py-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(19,112,62,0.2)] transition hover:bg-[#105f35] sm:px-8 sm:text-sm sm:tracking-[0.16em]"
            to="/donate"
          >
            {t('common.actions.donate')}
          </NavLink>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mx-auto mt-4 max-w-7xl xl:hidden">
          <nav
            aria-label={t('common.aria.mainNavigation')}
            className="grid gap-2 rounded-[1.3rem] border border-[#d8e5ec] bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            id="mobile-navigation"
          >
            <div className="px-1 pb-2">
              <LanguageSwitcher />
            </div>

            <NavLink className={mobileLinkClass} to="/" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink className={mobileLinkClass} to="/about" onClick={() => setIsMenuOpen(false)}>
              {t('nav.about')}
            </NavLink>
            <NavLink className={mobileLinkClass} to="/gallery" onClick={() => setIsMenuOpen(false)}>
              {t('nav.gallery')}
            </NavLink>

            <div className="rounded-xl border border-[#e2ebf0] bg-[#fbfdfe] p-2">
              <NavLink
                className={mobileLinkClass}
                to="/programs"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.programs')}
              </NavLink>
              <div className="mt-1 grid gap-1 pl-3">
                <NavLink
                  className={mobileLinkClass}
                  to="/programs/alokayon-school"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.school')}
                </NavLink>
                <NavLink
                  className={mobileLinkClass}
                  to="/programs/madrasa"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.madrasah')}
                </NavLink>
              </div>
            </div>

            <div className="rounded-xl border border-[#e2ebf0] bg-[#fbfdfe] p-2">
              <div className="px-4 py-3 text-[1rem] font-semibold text-[#115b82]">
                {t('nav.impact')}
              </div>
              <div className="grid gap-1 pl-3">
                <NavLink
                  className={mobileLinkClass}
                  to="/opinions-of-beneficiaries"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.voices')}
                </NavLink>
                <NavLink
                  className={mobileLinkClass}
                  to="/our-donors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.donors')}
                </NavLink>
              </div>
            </div>

            <NavLink
              className={mobileLinkClass}
              to="/zakat-calculator"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.zakatCalculator')}
            </NavLink>
            <NavLink
              className={mobileLinkClass}
              to="/transparency"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.transparency')}
            </NavLink>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Header
