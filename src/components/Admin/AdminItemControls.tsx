import { useTranslation } from 'react-i18next'

type AdminItemControlsProps = {
  isActive: boolean
  isBusy: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  reorderDisabled?: boolean
  viewHref?: string
  onMove: (direction: -1 | 1) => void
  onToggleVisibility: () => void
}

const iconButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dbe7ee] bg-white text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd] disabled:cursor-not-allowed disabled:opacity-40'

// Ordering, visibility, and "view on site" controls shared by the admin list pages.
function AdminItemControls({
  isActive,
  isBusy,
  canMoveUp,
  canMoveDown,
  reorderDisabled = false,
  viewHref,
  onMove,
  onToggleVisibility,
}: AdminItemControlsProps) {
  const { t } = useTranslation()
  const reorderTitle = reorderDisabled ? t('admin.list.reorderDisabled') : undefined

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        aria-label={t('admin.list.moveUp')}
        className={iconButtonClass}
        disabled={isBusy || reorderDisabled || !canMoveUp}
        onClick={() => onMove(-1)}
        title={reorderTitle ?? t('admin.list.moveUp')}
        type="button"
      >
        <span className="material-symbols-outlined text-[1.1rem]">arrow_upward</span>
      </button>
      <button
        aria-label={t('admin.list.moveDown')}
        className={iconButtonClass}
        disabled={isBusy || reorderDisabled || !canMoveDown}
        onClick={() => onMove(1)}
        title={reorderTitle ?? t('admin.list.moveDown')}
        type="button"
      >
        <span className="material-symbols-outlined text-[1.1rem]">arrow_downward</span>
      </button>
      <button
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#14324d] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isBusy}
        onClick={onToggleVisibility}
        type="button"
      >
        <span className="material-symbols-outlined text-[1rem]">
          {isActive ? 'visibility_off' : 'visibility'}
        </span>
        {isActive ? t('admin.list.hide') : t('admin.list.show')}
      </button>
      {viewHref && isActive ? (
        <a
          className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
          href={viewHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('admin.list.viewOnSite')}
          <span className="material-symbols-outlined text-[1rem]">open_in_new</span>
        </a>
      ) : null}
    </div>
  )
}

export default AdminItemControls
