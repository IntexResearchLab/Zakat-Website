import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="inline-flex items-center gap-2 text-[0.82rem] font-semibold text-[#627786] sm:text-[0.88rem]">
      {(['en', 'bn'] as const).map((language) => {
        const isActive = i18n.language === language

        return (
          <div className="contents" key={language}>
            {language === 'bn' ? (
              <span aria-hidden="true" className="text-[#b2c3cf]">
                |
              </span>
            ) : null}
            <button
              aria-label={t(`app.languages.${language}`)}
              className={`transition ${
                isActive ? 'text-[#115b82]' : 'text-[#6f8796] hover:text-[#115b82]'
              }`}
              type="button"
              onClick={() => void i18n.changeLanguage(language)}
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
