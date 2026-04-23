import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import TransparencyContents from '../components/Transparency/TransparencyContents'
import TransparencyAtAGlance from '../components/Transparency/TransparencyAtAGlance'
import TransparencyCta from '../components/Transparency/TransparencyCta'
import TransparencyDocuments from '../components/Transparency/TransparencyDocuments'
import TransparencyFinancialSnapshot from '../components/Transparency/TransparencyFinancialSnapshot'
import TransparencyHero from '../components/Transparency/TransparencyHero'
import TransparencyHighlights from '../components/Transparency/TransparencyHighlights'
import TransparencyMagazineLibrary from '../components/Transparency/TransparencyMagazineLibrary'
import type { MagazineIssue } from '../components/Transparency/types'

function Transparency() {
  const { t } = useTranslation()
  const issues = t('transparency.issues', {
    returnObjects: true,
  }) as MagazineIssue[]
  const [selectedYear, setSelectedYear] = useState(issues[0]?.year ?? '2025')

  const selectedIssue = useMemo(
    () => issues.find((issue) => issue.year === selectedYear) ?? issues[0],
    [issues, selectedYear],
  )

  return (
    <>
      <TransparencyHero latestIssue={issues[0]} />
      <TransparencyHighlights />
      <TransparencyAtAGlance latestIssue={issues[0]} />
      <TransparencyMagazineLibrary
        issues={issues}
        onSelectYear={setSelectedYear}
        selectedIssue={selectedIssue}
      />
      <TransparencyContents selectedIssue={selectedIssue} />
      <TransparencyDocuments selectedIssue={selectedIssue} />
      <TransparencyFinancialSnapshot />
      <TransparencyCta latestIssue={issues[0]} />
    </>
  )
}

export default Transparency
