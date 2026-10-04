import { useTranslation } from 'react-i18next'

export type VisibilityFilter = 'all' | 'visible' | 'hidden'

type SelectOption = {
  value: string
  label: string
}

type AdminListFiltersProps = {
  search: string
  searchPlaceholder: string
  visibility: VisibilityFilter
  shownCount: number
  totalCount: number
  category?: string
  categoryOptions?: SelectOption[]
  onSearchChange: (value: string) => void
  onVisibilityChange: (value: VisibilityFilter) => void
  onCategoryChange?: (value: string) => void
  onClear: () => void
}

const fieldClass =
  'rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'

function AdminListFilters({
  search,
  searchPlaceholder,
  visibility,
  shownCount,
  totalCount,
  category,
  categoryOptions,
  onSearchChange,
  onVisibilityChange,
  onCategoryChange,
  onClear,
}: AdminListFiltersProps) {
  const { t } = useTranslation()
  const isFiltered = Boolean(search.trim()) || visibility !== 'all' || (category ?? 'all') !== 'all'

  return (
    <div className="mt-5 space-y-3">
      <div className="space-y-3">
        <label className="relative block">
          <span className="sr-only">{searchPlaceholder}</span>
          <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-[#5d6d78]">
            search
          </span>
          <input
            className={`${fieldClass} w-full pl-10`}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            type="search"
            value={search}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          {categoryOptions && onCategoryChange ? (
            <select
              aria-label={t('admin.list.categoryFilter')}
              className={`${fieldClass} min-w-[11rem] flex-1`}
              onChange={(event) => onCategoryChange(event.target.value)}
              value={category}
            >
              <option value="all">{t('admin.list.allCategories')}</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : null}
          <select
            aria-label={t('admin.list.visibilityFilter')}
            className={`${fieldClass} min-w-[11rem] flex-1`}
            onChange={(event) => onVisibilityChange(event.target.value as VisibilityFilter)}
            value={visibility}
          >
            <option value="all">{t('admin.list.statusAll')}</option>
            <option value="visible">{t('admin.list.statusVisible')}</option>
            <option value="hidden">{t('admin.list.statusHidden')}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[0.84rem] text-[#5d6d78]">
        <p>{t('admin.list.showingCount', { shown: shownCount, total: totalCount })}</p>
        {isFiltered ? (
          <button
            className="font-semibold text-[#115b82] transition hover:text-[#0d4f72]"
            onClick={onClear}
            type="button"
          >
            {t('admin.list.clearFilters')}
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default AdminListFilters
