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
      description: 'Livelihood assets distributed, including ducks, goats, sewing machines, and similar tools.',
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

type UiStat = {
  value: string
  label: string
}

type UiOutcome = {
  year: string
  value: string
  label: string
}

export const getHomeImpactStats = (t: TFunction): UiStat[] => [
  ...(
    t('home.impact.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.organization.studentsSupported.value,
      statsInventory.organization.annualDistribution.value,
      statsInventory.organization.widowsSupported.value,
      statsInventory.organization.livelihoodsDistributed.value,
    ][index],
    label: item.label,
  })),
]

export const getHomeSignatureProgramStats = (t: TFunction) => {
  const cards = t('home.impact.programCards', { returnObjects: true }) as ProgramCardTranslation[]

  return cards.map((card, index) => ({
    ...card,
    microStat:
      index === 0
        ? `${statsInventory.school.childrenLearning.value} children learning`
        : `${statsInventory.madrasa.studentsEnrolled.value} students enrolled`,
  }))
}

export const getAboutOverviewStats = (t: TFunction): UiStat[] => [
  ...(
    t('about.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.organization.foundedYear.value,
      statsInventory.organization.studentsSupported.value,
      statsInventory.organization.familiesAssisted.value,
      statsInventory.organization.programsRunning.value,
    ][index],
    label: item.label,
  })),
]

export const getProgramHeroStats = (t: TFunction): UiStat[] => [
  ...(
    t('programs.hero.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.organization.studentsSupported.value,
      statsInventory.organization.familiesAssisted.value,
    ][index],
    label: item.label,
  })),
]

export const getFeaturedSchoolStats = (t: TFunction): UiStat[] => [
  ...(
    t('programs.featured.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.school.childrenLearning.value,
      statsInventory.school.formalLaunchYear.value,
      statsInventory.school.totalAdmissions.value,
    ][index],
    label: item.label,
  })),
]

export const getFeaturedMadrasaStats = (t: TFunction): UiStat[] => [
  ...(
    t('programs.featuredMadrasa.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.madrasa.studentsEnrolled.value,
      statsInventory.madrasa.hifzStudents.value,
      statsInventory.organization.registeredYear.value,
    ][index],
    label: item.label,
  })),
]

export const getProgramsImpactStats = (t: TFunction): UiStat[] => [
  ...(
    t('programs.impact.items', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.organization.studentsSupported.value,
      statsInventory.organization.elderlySupported.value,
      statsInventory.organization.widowsSupported.value,
      '25+',
    ][index],
    label: item.label,
  })),
]

export const getSchoolImpactStatsFromInventory = (t: TFunction): UiStat[] => [
  ...(
    t('school.impact.items', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.school.childrenLearning.value,
      statsInventory.school.formalLaunchDate.value,
      statsInventory.school.totalAdmissions.value,
      'Arabic + Bengali',
    ][index],
    label: item.label,
  })),
]

export const getSchoolOutcomesFromInventory = (t: TFunction): UiOutcome[] => [
  ...(
    t('school.outcomes.items', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    year: ['2023', '2024', '2025'][index],
    value: [
      statsInventory.school.admissions2023.value,
      statsInventory.school.admissions2024.value,
      statsInventory.school.admissions2025.value,
    ][index],
    label: item.label,
  })),
]

export const getMadrasaImpactStatsFromInventory = (t: TFunction): UiStat[] => [
  ...(
    t('madrasa.impact.items', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.madrasa.studentsEnrolled.value,
      statsInventory.madrasa.underprivilegedBackground.value,
      statsInventory.madrasa.hifzStudents.value,
      'Arabic + Bengali',
    ][index],
    label: item.label,
  })),
]

export const getTransparencyFinancialNumbers = (t: TFunction): UiStat[] => [
  ...(
    t('transparency.financial.numbers', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.finance.receipts2024to2025.value,
      statsInventory.finance.distribution2024to2025.value,
    ][index],
    label: item.label,
  })),
]

export const getGalleryImpactStats = (t: TFunction): UiStat[] => [
  ...(
    t('galleryPage.impact.stats', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.organization.studentsSupported.value,
      statsInventory.organization.annualDistribution.value,
      statsInventory.organization.livelihoodsDistributed.value,
      `Since ${statsInventory.organization.foundedYear.value}`,
    ][index],
    label: item.label,
  })),
]

export const getDonateTransparencySummary = (t: TFunction): UiStat[] => [
  ...(
    t('donate.transparency.summary', { returnObjects: true }) as LabelItem[]
  ).map((item, index) => ({
    value: [
      statsInventory.finance.receipts2024to2025.value,
      statsInventory.finance.distribution2024to2025.value,
      statsInventory.organization.beneficiariesReached.value,
      statsInventory.organization.studentsSupported.value,
    ][index],
    label: item.label,
  })),
]
