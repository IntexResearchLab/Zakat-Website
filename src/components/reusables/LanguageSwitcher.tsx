import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../../i18n'

// Each language is named in its own language, so speakers can find theirs.
const languages = [
  { code: 'en', name: 'English' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'de', name: 'Deutsch' },
] as const

type LanguageCode = (typeof languages)[number]['code']

type LanguageSwitcherProps = {
  // dropdown: a globe button that opens a menu (header and footer).
  // buttons: all three side by side, for the mobile menu where taps beat menus.
  variant?: 'dropdown' | 'buttons'
  // dark: for the footer's dark background; the menu then opens upwards.
  tone?: 'light' | 'dark'
  // Shows only the globe below the 2xl breakpoint, where the header menu needs the room.
  compact?: boolean
}

const currentLanguage = (language: string): LanguageCode =>
  languages.find((item) => language.startsWith(item.code))?.code ?? 'en'

function LanguageSwitcher({ variant = 'dropdown', tone = 'light', compact = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const active = currentLanguage(i18n.language)

  if (variant === 'buttons') {
    return (
      <div
        aria-label={t('common.aria.language')}
        className="flex items-center gap-1 rounded-full border border-[#d8e5ec] bg-[#f4f8fb] p-1"
        role="group"
      >
        {languages.map((language) => {
          const isActive = active === language.code

          return (
            <button
              aria-pressed={isActive}
              className={`flex-1 rounded-full px-3 py-2 text-[0.9rem] font-semibold transition ${
                isActive
                  ? 'bg-white text-[#115b82] shadow-[0_2px_8px_rgba(15,23,42,0.08)]'
                  : 'text-[#5d6d78] hover:text-[#115b82]'
              }`}
              key={language.code}
              lang={language.code}
              type="button"
              onClick={() => void changeLanguage(language.code)}
            >
              {language.name}
            </button>
          )
        })}
      </div>
    )
  }

  const isDark = tone === 'dark'
  const activeName = languages.find((language) => language.code === active)?.name

  // Opens on click or keyboard; closes on Escape, on choosing a language, or when focus leaves.
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
    >
      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={`${t('common.aria.language')}: ${activeName}`}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-[0.88rem] font-semibold transition ${
          isDark
            ? 'border-white/15 text-[#c9dbe6] hover:border-white/30 hover:text-white'
            : 'border-[#cfe0ea] bg-white text-[#115b82] hover:bg-[#eef7fb]'
        }`}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[1.15rem]">
          language
        </span>
        <span className={compact ? 'hidden 2xl:inline' : undefined} lang={active}>
          {activeName}
        </span>
        <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
          {isDark ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      <div
        className={`absolute right-0 z-30 w-44 transition duration-150 ${
          isDark ? 'bottom-full pb-2' : 'top-full pt-2'
        } ${isOpen ? 'opacity-100' : 'pointer-events-none invisible opacity-0'}`}
        id={menuId}
      >
        <ul className="grid gap-1 rounded-[1.15rem] border border-[#d8e5ec] bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          {languages.map((language) => {
            const isActive = active === language.code

            return (
              <li key={language.code}>
                <button
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[0.94rem] transition ${
                    isActive
                      ? 'bg-[#eef7fb] font-semibold text-[#115b82]'
                      : 'font-medium text-[#587189] hover:bg-[#f4fafc] hover:text-[#115b82]'
                  }`}
                  lang={language.code}
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    void changeLanguage(language.code)
                  }}
                >
                  {language.name}
                  {isActive ? (
                    <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
                      check
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default LanguageSwitcher
