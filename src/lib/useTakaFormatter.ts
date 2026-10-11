import { useTranslation } from 'react-i18next'

// Taka amounts with Bangladeshi grouping (৳1,80,000), in Bangla digits for Bangla and German grouping (৳180.000) for German.
export const useTakaFormatter = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'bn' ? 'bn-BD' : i18n.language === 'de' ? 'de-DE' : 'en-IN'
  return (value: number) => `৳${value.toLocaleString(locale, { maximumFractionDigits: 0 })}`
}

// Dates in the reader's language: "11 October 2026", "১১ অক্টোবর, ২০২৬", "11. Oktober 2026".
export const useDateFormatter = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'bn' ? 'bn-BD' : i18n.language === 'de' ? 'de-DE' : 'en-GB'
  return (value: string | Date) =>
    new Date(value).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}
