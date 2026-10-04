import { useTranslation } from 'react-i18next'

// Taka amounts with Bangladeshi grouping (৳1,80,000), in Bangla digits when reading in Bangla.
export const useTakaFormatter = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'bn' ? 'bn-BD' : 'en-IN'
  return (value: number) => `৳${value.toLocaleString(locale, { maximumFractionDigits: 0 })}`
}
