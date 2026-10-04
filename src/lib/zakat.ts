// Zakat arithmetic for the calculator page. Kept free of React so it can be checked on its own.

// Nisab weights in grams: 7.5 tola (bhori) of gold and 52.5 tola of silver.
export const GOLD_NISAB_GRAMS = 87.48
export const SILVER_NISAB_GRAMS = 612.36
// One vori (bhori/tola), the unit Bangladeshi jewellers use.
export const GRAMS_PER_VORI = 11.664
export const ZAKAT_RATE = 0.025

export type NisabBasis = 'silver' | 'gold'
export type WeightUnit = 'vori' | 'gram'

export type ZakatInput = {
  cash: number
  goldWeight: number
  goldUnit: WeightUnit
  goldPricePerGram: number
  silverWeight: number
  silverUnit: WeightUnit
  silverPricePerGram: number
  investments: number
  businessStock: number
  receivables: number
  otherAssets: number
  debtsDue: number
  nisabBasis: NisabBasis
}

export type ZakatResult = {
  goldValue: number
  silverValue: number
  totalAssets: number
  deductions: number
  netWealth: number
  // Null when the price needed for the chosen nisab hasn't been entered.
  nisabThreshold: number | null
  isAboveNisab: boolean
  zakatDue: number
}

const toGrams = (weight: number, unit: WeightUnit) => (unit === 'vori' ? weight * GRAMS_PER_VORI : weight)

const positive = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0)

export const calculateZakat = (input: ZakatInput): ZakatResult => {
  const goldValue = toGrams(positive(input.goldWeight), input.goldUnit) * positive(input.goldPricePerGram)
  const silverValue =
    toGrams(positive(input.silverWeight), input.silverUnit) * positive(input.silverPricePerGram)

  const totalAssets =
    positive(input.cash) +
    goldValue +
    silverValue +
    positive(input.investments) +
    positive(input.businessStock) +
    positive(input.receivables) +
    positive(input.otherAssets)
  const deductions = positive(input.debtsDue)
  const netWealth = Math.max(0, totalAssets - deductions)

  const nisabPrice = input.nisabBasis === 'gold' ? input.goldPricePerGram : input.silverPricePerGram
  const nisabGrams = input.nisabBasis === 'gold' ? GOLD_NISAB_GRAMS : SILVER_NISAB_GRAMS
  const nisabThreshold = positive(nisabPrice) > 0 ? nisabGrams * nisabPrice : null

  const isAboveNisab = nisabThreshold !== null && netWealth > 0 && netWealth >= nisabThreshold
  // Rounded up to the next taka, so the amount paid is never short.
  const zakatDue = isAboveNisab ? Math.ceil(netWealth * ZAKAT_RATE) : 0

  return { goldValue, silverValue, totalAssets, deductions, netWealth, nisabThreshold, isAboveNisab, zakatDue }
}

// Accepts Bangla digits and thousands separators, e.g. "১,২০,০০০" or "120,000".
export const parseAmount = (text: string) => {
  const latin = text.replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)))
  const cleaned = latin.replace(/[^\d.]/g, '')
  const value = Number.parseFloat(cleaned)
  return Number.isFinite(value) ? value : 0
}
