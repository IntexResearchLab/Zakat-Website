import { useTranslation } from 'react-i18next'
import { changeLanguage } from '../../i18n'

// Each language is named in its own language, so speakers can find theirs.
const languageNames = { en: 'English', bn: 'বাংলা', de: 'Deutsch' } as const

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div
      aria-label={t('common.aria.language')}
      className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-[#627786] sm:text-[0.88rem]"
      role="group"
    >
      {(['en', 'bn', 'de'] as const).map((language) => {
        const isActive = i18n.language === language

        return (
          <div className="contents" key={language}>
            {language !== 'en' ? (
              <span aria-hidden="true" className="text-[#b2c3cf]">
                |
              </span>
            ) : null}
            <button
              aria-label={languageNames[language]}
              aria-pressed={isActive}
              className={`transition ${
                isActive ? 'text-[#115b82]' : 'text-[#5d6d78] hover:text-[#115b82]'
              }`}
              lang={language}
              type="button"
              onClick={() => void changeLanguage(language)}
            >
              {t(`app.languages.${language}`)}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
