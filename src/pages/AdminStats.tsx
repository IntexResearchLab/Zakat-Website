import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import {
  getStatsInventoryRows,
  type PublicStatsGroup,
  type PublicStatsKey,
} from '../content/stats'
import { getFriendlyErrorMessage } from '../lib/adminErrors'
import { invalidatePublicStatsCache } from '../lib/publicStats'
import { supabase } from '../utils/supabase'

type PublicStatRow = {
  id: string
  key: PublicStatsKey
  value: string
  description: string | null
  group_name: PublicStatsGroup
  sort_order: number
  is_active: boolean
  updated_at: string | null
}

type EditableStatsMap = Record<PublicStatsKey, string>

const defaultRows = getStatsInventoryRows()

// "receipts2024to2025" -> "Receipts 2024–2025", "hifzStudents" -> "Hifz students"
const humanizeStatKey = (key: string) => {
  const spaced = key
    .replace(/(\d+)to(\d+)/g, ' $1–$2')
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .trim()
    .toLowerCase()

  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

function AdminStats() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<PublicStatRow[]>([])
  const [draftValues, setDraftValues] = useState<EditableStatsMap>(() =>
    defaultRows.reduce((accumulator, row) => {
      accumulator[row.key] = row.value
      return accumulator
    }, {} as EditableStatsMap),
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const sourceRows = useMemo(
    () =>
      rows.length
        ? rows
        : defaultRows.map((row, index) => ({
            id: `${row.groupName}-${row.key}-${index}`,
            key: row.key,
            value: row.value,
            description: row.description,
            group_name: row.groupName,
            sort_order: row.sortOrder,
            is_active: row.isActive,
            updated_at: null,
          })),
    [rows],
  )

  const groupedRows = useMemo(
    () =>
      sourceRows.reduce(
        (accumulator, row) => {
          const groupRows = accumulator[row.group_name] ?? []
          groupRows.push(row)
          accumulator[row.group_name] = groupRows.sort(
            (left, right) => left.sort_order - right.sort_order,
          )
          return accumulator
        },
        {} as Record<PublicStatsGroup, PublicStatRow[]>,
      ),
    [sourceRows],
  )

  const statCount = useMemo(() => Object.values(groupedRows).flat().length, [groupedRows])

  const changedRows = useMemo(
    () =>
      sourceRows.filter((row) => {
        const draftValue = draftValues[row.key] ?? ''
        return draftValue.trim() !== row.value
      }),
    [draftValues, sourceRows],
  )

  const unsavedCount = changedRows.length

  const loadStats = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('public_stats')
      .select('*')
      .order('group_name', { ascending: true })
      .order('sort_order', { ascending: true })

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
      setIsLoading(false)
      return
    }

    const nextRows = (data ?? []) as PublicStatRow[]
    setRows(nextRows)
    setDraftValues((current) => {
      const nextDrafts = { ...current }
      nextRows.forEach((row) => {
        nextDrafts[row.key] = row.value
      })
      return nextDrafts
    })
    setIsLoading(false)
  }

  useEffect(() => {
    // We intentionally load the current public stats once when the admin page opens.
    void loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleValueChange = (key: PublicStatsKey, value: string) => {
    setSuccessMessage('')
    setDraftValues((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleResetChanges = () => {
    setErrorMessage('')
    setSuccessMessage('')
    setDraftValues((current) => {
      const nextDrafts = { ...current }
      sourceRows.forEach((row) => {
        nextDrafts[row.key] = row.value
      })
      return nextDrafts
    })
  }

  const handleSaveAll = async () => {
    if (!changedRows.length) {
      return
    }

    const invalidRow = changedRows.find((row) => !draftValues[row.key]?.trim())

    if (invalidRow) {
      setErrorMessage(t('admin.stats.validationError'))
      return
    }

    setIsSavingAll(true)
    setErrorMessage('')
    setSuccessMessage('')

    const timestamp = new Date().toISOString()
    const updates = changedRows.map((row) =>
      supabase
        .from('public_stats')
        .update({
          value: draftValues[row.key].trim(),
          updated_at: timestamp,
        })
        .eq('id', row.id),
    )

    const results = await Promise.all(updates)
    // Updates run independently, so keep the ones that succeeded even if another failed.
    const savedRows = changedRows.filter((_, index) => !results[index].error)
    const firstError = results.find((result) => result.error)?.error

    if (savedRows.length) {
      invalidatePublicStatsCache()
      setRows((current) =>
        current.map((item) => {
          const savedRow = savedRows.find((row) => row.id === item.id)
          return savedRow
            ? {
                ...item,
                value: draftValues[savedRow.key].trim(),
                updated_at: timestamp,
              }
            : item
        }),
      )
      setDraftValues((current) => {
        const nextDrafts = { ...current }
        savedRows.forEach((row) => {
          nextDrafts[row.key] = draftValues[row.key].trim()
        })
        return nextDrafts
      })
      setSuccessMessage(t('admin.stats.saveSuccess', { count: savedRows.length }))
    }

    if (firstError) {
      setErrorMessage(
        savedRows.length
          ? t('admin.stats.partialSaveError', {
              count: changedRows.length - savedRows.length,
              reason: getFriendlyErrorMessage(t, firstError),
            })
          : getFriendlyErrorMessage(t, firstError),
      )
    }

    setIsSavingAll(false)
  }

  return (
    <AdminShellLayout
      description={t('admin.stats.description')}
      eyebrow={t('admin.stats.eyebrow')}
      headerActions={
        <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            {t('admin.stats.headerCardLabel')}
          </p>
          <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {statCount}
          </p>
          <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#6a7c87]">
            {t('admin.stats.headerCardContext')}
          </p>
        </div>
      }
      hasUnsavedChanges={unsavedCount > 0}
      title={t('admin.stats.title')}
    >
      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 border-b border-[#edf3f7] pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('admin.stats.libraryTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.stats.libraryIntro')}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
              onClick={() => void loadStats()}
              type="button"
            >
              <span className="material-symbols-outlined text-[1rem]">refresh</span>
              {t('admin.stats.refresh')}
            </button>
          </div>
        </div>

        <div
          className={`sticky top-[4.25rem] z-20 mt-5 flex flex-col gap-3 rounded-[1rem] border p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-sm transition sm:flex-row sm:items-center sm:justify-between lg:top-4 ${
            unsavedCount
              ? 'border-[#9fc7da] bg-[#f2f9fd]/95'
              : 'border-[#edf3f7] bg-[#fbfdff]/95'
          }`}
        >
          <p className="text-[0.92rem] leading-[1.7] text-[#627581]">
            {t('admin.stats.unsavedChanges', { count: unsavedCount })}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-[#dbe7ee] bg-white px-5 py-2.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:border-[#c2d7e6] hover:bg-[#f9fcfe] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!unsavedCount || isSavingAll}
              onClick={handleResetChanges}
              type="button"
            >
              {t('admin.stats.resetButton')}
            </button>
            <button
              className="rounded-full bg-[#13703e] px-5 py-2.5 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#74a889]"
              disabled={!unsavedCount || isSavingAll}
              onClick={() => void handleSaveAll()}
              type="button"
            >
              {isSavingAll ? t('admin.stats.savingAll') : t('admin.stats.saveAllButton')}
            </button>
          </div>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-5 rounded-[1rem] border border-[#cde7d8] bg-[#f5fbf7] px-4 py-3 text-sm leading-[1.7] text-[#13703e]">
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
            {t('admin.stats.loading')}
          </div>
        ) : null}

        {!isLoading ? (
          <div className="mt-6 space-y-8">
            {Object.entries(groupedRows).map(([groupName, groupRows]) => (
              <section key={groupName}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                      {t(`admin.stats.groups.${groupName}.eyebrow`)}
                    </p>
                    <h3 className="mt-2 font-serif text-[1.55rem] leading-none tracking-[-0.03em] text-[#14324d]">
                      {t(`admin.stats.groups.${groupName}.title`)}
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {groupRows.map((row) => {
                    const hasPendingChange = (draftValues[row.key] ?? '').trim() !== row.value

                    return (
                      <article
                        className="rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5"
                        key={row.id}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-serif text-[1.2rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                              {t(`admin.stats.labels.${row.key}`, {
                                defaultValue: humanizeStatKey(row.key),
                              })}
                            </p>
                            <p className="mt-2 text-[0.95rem] leading-[1.7] text-[#627581]">
                              {row.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <label
                            className="mb-2 block text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]"
                            htmlFor={`stat-${row.key}`}
                          >
                            {t('admin.stats.valueLabel')}
                          </label>
                          <input
                            id={`stat-${row.key}`}
                            className={`w-full rounded-[0.95rem] border bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] ${
                              hasPendingChange
                                ? 'border-[#9fc7da] ring-2 ring-[#e4f1f8]'
                                : 'border-[#d8e5ec]'
                            }`}
                            onChange={(event) => handleValueChange(row.key, event.target.value)}
                            value={draftValues[row.key] ?? ''}
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <p className="text-[0.78rem] text-[#8a9ba7]">
                            {row.updated_at
                              ? new Date(row.updated_at).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : t('admin.stats.notUpdatedYet')}
                          </p>
                          {hasPendingChange ? (
                            <span className="rounded-full border border-[#cfe2ee] bg-white px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                              {t('admin.stats.pendingChange')}
                            </span>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </AdminShellLayout>
  )
}

export default AdminStats
