import type { TFunction } from 'i18next'

export type StatInventoryEntry = {
  value: string
  description: string
}

type LabelItem = {
  label: string
}

type ProgramCardTranslation = {
  title: string
  description: string
  cta: string
  href: string
  icon: string
}

type UiStat = {
  value: string
  label: string
}

type UiOutcome = {
  year: string
  value: string
  label: string
}

export const statsInventory = {
  organization: {
    foundedYear: {
      value: '2011',
      description: 'Year the initiative began informally.',
    },
    registeredYear: {
      value: '2019',
      description: 'Year of formal registration under the Social Welfare Department.',
    },
    studentsSupported: {
      value: '200+',
      description: 'Students supported across Alokayon education programs.',
    },
    familiesAssisted: {
      value: '100+',
      description: 'Families assisted through direct support and relief.',
    },
    programsRunning: {
      value: '6+',
      description: 'Number of major active program categories currently highlighted on the site.',
    },
    beneficiariesReached: {
      value: '100+',
      description: 'High-level public-facing count of beneficiaries reached.',
    },
    widowsSupported: {
      value: '70+',
      description: 'Widows supported through direct aid and livelihood programs.',
    },
    elderlySupported: {
      value: '60+',
      description: 'Elderly people receiving allowance/support.',
    },
    livelihoodsDistributed: {
      value: '500+',
      description:
        'Livelihood assets distributed, including ducks, goats, sewing machines, and similar tools.',
    },
    annualDistribution: {
      value: '1.3M+ BDT',
      description: 'Approximate public-facing annual distribution total.',
    },
    executiveCommitteeMembers: {
      value: '14',
      description: 'Number of executive committee members shown on the site.',
    },
  },
  school: {
    childrenLearning: {
      value: '50+',
      description: 'Children learning free of cost through Alokayon Pathshala.',
    },
    formalLaunchYear: {
      value: '2023',
      description: 'Formal launch year shown for Alokayon Pathshala.',
    },
    formalLaunchDate: {
      value: '13 Feb 2023',
      description: 'Formal inauguration date shown for Alokayon Pathshala.',
    },
    totalAdmissions: {
      value: '45',
      description: 'Underprivileged children moved into formal primary education in three years.',
    },
    admissions2023: {
      value: '10',
      description: 'School admissions in 2023 from Alokayon Pathshala.',
    },
    admissions2024: {
      value: '10',
      description: 'School admissions in 2024 from Alokayon Pathshala.',
    },
    admissions2025: {
      value: '25',
      description: 'School admissions in 2025 from Alokayon Pathshala.',
    },
  },
  madrasa: {
    studentsEnrolled: {
      value: '100+',
      description: 'Students enrolled in Abdul Karim Miazi Hafezi Madrasa.',
    },
    underprivilegedBackground: {
      value: '80%',
      description: 'Share of students described as coming from underprivileged backgrounds.',
    },
    hifzStudents: {
      value: '31',
      description: 'Students currently memorizing Qur’an in the Hifz program.',
    },
  },
  finance: {
    receipts2024to2025: {
      value: '1.02M BDT',
      description: 'Approximate receipts shown for the 2024–25 financial period.',
    },
    distribution2024to2025: {
      value: '1.13M BDT',
      description: 'Approximate expenditure/distribution shown for the 2024–25 financial period.',
    },
  },
} as const satisfies Record<string, Record<string, StatInventoryEntry>>

export type PublicStatsKey = {
  [Group in keyof typeof statsInventory]: keyof (typeof statsInventory)[Group]
}[keyof typeof statsInventory]

export type PublicStatsGroup = keyof typeof statsInventory

export type PublicStatsRecord = Record<PublicStatsKey, string>

const defaultStatsMap = Object.entries(statsInventory).reduce((accumulator, [, entries]) => {
  Object.entries(entries).forEach(([key, entry]) => {
    accumulator[key as PublicStatsKey] = entry.value
  })
  return accumulator
}, {} as PublicStatsRecord)

let currentStatsMap: PublicStatsRecord = { ...defaultStatsMap }

export const getDefaultStatsMap = () => ({ ...defaultStatsMap })

export const getCurrentStatsMap = () => ({ ...currentStatsMap })

export const setCurrentStatsMap = (nextMap: Partial<Record<PublicStatsKey, string>>) => {
  currentStatsMap = {
    ...defaultStatsMap,
    ...nextMap,
  }
}

export const resetCurrentStatsMap = () => {
  currentStatsMap = { ...defaultStatsMap }
}

export const getStatValue = (key: PublicStatsKey) =>
  currentStatsMap[key] ?? defaultStatsMap[key]

export type PublicStatAdminRow = {
  key: PublicStatsKey
  value: string
  description: string
  groupName: PublicStatsGroup
  sortOrder: number
  isActive: boolean
}

export const getStatsInventoryRows = (): PublicStatAdminRow[] =>
  (Object.entries(statsInventory) as Array<
    [PublicStatsGroup, Record<string, StatInventoryEntry>]
  >).flatMap(([groupName, entries]) =>
    Object.entries(entries).map(([key, entry], index) => ({
      key: key as PublicStatsKey,
      value: entry.value,
      description: entry.description,
      groupName,
      sortOrder: index + 1,
      isActive: true,
    })),
  )

export const getHomeImpactStats = (t: TFunction): UiStat[] =>
  (t('home.impact.stats', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('studentsSupported'),
      getStatValue('annualDistribution'),
      getStatValue('widowsSupported'),
      getStatValue('livelihoodsDistributed'),
    ][index],
    label: item.label,
  }))

export const getHomeSignatureProgramStats = (t: TFunction) => {
  const cards = t('home.impact.programCards', { returnObjects: true }) as ProgramCardTranslation[]

  return cards.map((card, index) => ({
    ...card,
    microStat:
      index === 0
        ? `${getStatValue('childrenLearning')} children learning`
        : `${getStatValue('studentsEnrolled')} students enrolled`,
  }))
}

export const getAboutOverviewStats = (t: TFunction): UiStat[] =>
  (t('about.stats', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('foundedYear'),
      getStatValue('studentsSupported'),
      getStatValue('familiesAssisted'),
      getStatValue('programsRunning'),
    ][index],
    label: item.label,
  }))

export const getProgramHeroStats = (t: TFunction): UiStat[] =>
  (t('programs.hero.stats', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [getStatValue('studentsSupported'), getStatValue('familiesAssisted')][index],
    label: item.label,
  }))

export const getFeaturedSchoolStats = (t: TFunction): UiStat[] =>
  (t('programs.featured.stats', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [getStatValue('childrenLearning'), getStatValue('formalLaunchYear'), getStatValue('totalAdmissions')][index],
    label: item.label,
  }))

export const getFeaturedMadrasaStats = (t: TFunction): UiStat[] =>
  (t('programs.featuredMadrasa.stats', { returnObjects: true }) as LabelItem[]).map(
    (item, index) => ({
      value: [getStatValue('studentsEnrolled'), getStatValue('hifzStudents'), getStatValue('registeredYear')][index],
      label: item.label,
    }),
  )

export const getProgramsImpactStats = (t: TFunction): UiStat[] =>
  (t('programs.impact.items', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('studentsSupported'),
      getStatValue('elderlySupported'),
      getStatValue('widowsSupported'),
      '25+',
    ][index],
    label: item.label,
  }))

export const getSchoolImpactStatsFromInventory = (t: TFunction): UiStat[] =>
  (t('school.impact.items', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('childrenLearning'),
      getStatValue('formalLaunchDate'),
      getStatValue('totalAdmissions'),
      'Arabic + Bengali',
    ][index],
    label: item.label,
  }))

export const getSchoolOutcomesFromInventory = (t: TFunction): UiOutcome[] =>
  (t('school.outcomes.items', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    year: ['2023', '2024', '2025'][index],
    value: [getStatValue('admissions2023'), getStatValue('admissions2024'), getStatValue('admissions2025')][index],
    label: item.label,
  }))

export const getMadrasaImpactStatsFromInventory = (t: TFunction): UiStat[] =>
  (t('madrasa.impact.items', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('studentsEnrolled'),
      getStatValue('underprivilegedBackground'),
      getStatValue('hifzStudents'),
      'Arabic + Bengali',
    ][index],
    label: item.label,
  }))

export const getTransparencyFinancialNumbers = (t: TFunction): UiStat[] =>
  (t('transparency.financial.numbers', { returnObjects: true }) as LabelItem[]).map(
    (item, index) => ({
      value: [getStatValue('receipts2024to2025'), getStatValue('distribution2024to2025')][index],
      label: item.label,
    }),
  )

export const getGalleryImpactStats = (t: TFunction): UiStat[] =>
  (t('galleryPage.impact.stats', { returnObjects: true }) as LabelItem[]).map((item, index) => ({
    value: [
      getStatValue('studentsSupported'),
      getStatValue('annualDistribution'),
      getStatValue('livelihoodsDistributed'),
      `Since ${getStatValue('foundedYear')}`,
    ][index],
    label: item.label,
  }))

export const getDonateTransparencySummary = (t: TFunction): UiStat[] =>
  (t('donate.transparency.summary', { returnObjects: true }) as LabelItem[]).map(
    (item, index) => ({
      value: [
        getStatValue('receipts2024to2025'),
        getStatValue('distribution2024to2025'),
        getStatValue('beneficiariesReached'),
        getStatValue('studentsSupported'),
      ][index],
      label: item.label,
    }),
  )
