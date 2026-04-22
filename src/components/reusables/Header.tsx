import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import LanguageSwitcher from './LanguageSwitcher'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'border-b-[3px] border-[#115b82] pb-2 text-[0.98rem] font-semibold text-[#115b82]'
      : 'pb-2 text-[0.98rem] font-medium text-[#587189]'

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'rounded-xl bg-[#eef7fb] px-4 py-3 text-[1rem] font-semibold text-[#115b82]'
      : 'rounded-xl px-4 py-3 text-[1rem] font-medium text-[#587189]'

  return (
    <header className="border-b border-[#c5d8e5] bg-[#f7fcff] px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 sm:gap-6">
        <NavLink
          className="min-w-0 shrink font-serif text-[1.2rem] font-semibold leading-none tracking-[-0.03em] text-[#115b82] sm:text-[1.75rem]"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          {t('nav.brand')}
        </NavLink>

        <nav className="hidden items-center gap-11 md:flex">
          <NavLink className={linkClass} to="/">
            {t('nav.home')}
          </NavLink>
          <NavLink className={linkClass} to="/about">
            {t('nav.about')}
          </NavLink>
          <NavLink className={linkClass} to="/programs/alokayon-school">
            {t('nav.school')}
          </NavLink>
          <NavLink className={linkClass} to="/programs/madrasa">
            {t('nav.madrasah')}
          </NavLink>
          <NavLink className={linkClass} to="/opinions-of-beneficiaries">
            {t('nav.voices')}
          </NavLink>
          <NavLink className={linkClass} to="/programs">
            {t('nav.programs')}
          </NavLink>
          <a className="pb-2 text-[0.98rem] font-medium text-[#587189]" href="#">
            {t('nav.transparency')}
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <button
            aria-expanded={isMenuOpen}
            aria-label={t('common.aria.toggleNavigationMenu')}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#cfe0ea] bg-white text-[#115b82] transition hover:bg-[#eef7fb] md:hidden"
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined text-[1.35rem]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <NavLink
            className="rounded-full bg-[#115b82] px-4 py-2.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#0c4c6d] sm:px-8 sm:text-sm sm:tracking-[0.16em]"
            to="/"
          >
            {t('common.actions.donate')}
          </NavLink>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mx-auto mt-4 max-w-7xl md:hidden">
          <nav className="grid gap-2 rounded-[1.3rem] border border-[#d8e5ec] bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="px-1 pb-2">
              <LanguageSwitcher />
            </div>
            <NavLink className={mobileLinkClass} to="/" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </NavLink>
            <NavLink className={mobileLinkClass} to="/about" onClick={() => setIsMenuOpen(false)}>
              {t('nav.about')}
            </NavLink>
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
            <NavLink
              className={mobileLinkClass}
              to="/opinions-of-beneficiaries"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.voices')}
            </NavLink>
            <NavLink
              className={mobileLinkClass}
              to="/programs"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.programs')}
            </NavLink>
            <a className="rounded-xl px-4 py-3 text-[1rem] font-medium text-[#587189]" href="#">
              {t('nav.transparency')}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export default Header
