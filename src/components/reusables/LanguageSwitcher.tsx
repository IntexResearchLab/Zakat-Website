import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-[#cfe0ea] bg-white p-1 shadow-[0_8px_22px_rgba(15,23,42,0.04)]">
      {(['en', 'bn'] as const).map((language) => {
        const isActive = i18n.language === language

        return (
          <button
            key={language}
            aria-label={t(`app.languages.${language}`)}
            className={`rounded-full px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.12em] transition sm:text-[0.78rem] ${
              isActive
                ? 'bg-[#115b82] text-white'
                : 'text-[#5f7280] hover:bg-[#eef7fb] hover:text-[#115b82]'
            }`}
            type="button"
            onClick={() => void i18n.changeLanguage(language)}
          >
            {t(`app.languages.${language}`)}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
