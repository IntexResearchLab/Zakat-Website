import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en/common.json'
import { readStorage, writeStorage } from './lib/safeStorage'

const LANGUAGE_STORAGE_KEY = 'alokayon-language'
const supportedLanguages = ['en', 'bn', 'de'] as const
type SupportedLanguage = (typeof supportedLanguages)[number]

// English is bundled because it is the fallback for missing keys. Bangla and German are
// downloaded only when a visitor uses them, which keeps them out of everyone else's download.
const languageLoaders: Record<Exclude<SupportedLanguage, 'en'>, () => Promise<{ default: object }>> = {
  bn: () => import('./locales/bn/common.json'),
  de: () => import('./locales/de/common.json'),
}

const loadLanguage = async (language: SupportedLanguage) => {
  if (language === 'en' || i18n.hasResourceBundle(language, 'translation')) {
    return
  }

  const { default: resources } = await languageLoaders[language]()
  i18n.addResourceBundle(language, 'translation', resources)
}

export const changeLanguage = async (language: SupportedLanguage) => {
  await loadLanguage(language)
  await i18n.changeLanguage(language)
}

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const storedLanguage = readStorage(LANGUAGE_STORAGE_KEY)

  if (storedLanguage && supportedLanguages.includes(storedLanguage as SupportedLanguage)) {
    return storedLanguage as SupportedLanguage
  }

  return 'en'
}

const initialLanguage = getInitialLanguage()

// Resolves once the visitor's language is ready, so the first render is already translated.
export const i18nReady = i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: [...supportedLanguages],
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  })
  .then(() => changeLanguage(initialLanguage))
  // If a language file fails to download, the site still works in English.
  .catch((error: unknown) => console.error('[i18n]', error))

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    writeStorage(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export default i18n
