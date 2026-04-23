import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import bn from './locales/bn/common.json'
import en from './locales/en/common.json'

const LANGUAGE_STORAGE_KEY = 'alokayon-language'
const supportedLanguages = ['en', 'bn'] as const

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)

  if (storedLanguage && supportedLanguages.includes(storedLanguage as 'en' | 'bn')) {
    return storedLanguage
  }

  return 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    bn: {
      translation: bn,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...supportedLanguages],
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
})

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }
})

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language
}

export default i18n
