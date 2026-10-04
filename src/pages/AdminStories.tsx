import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AdminImageInput from '../components/Admin/AdminImageInput'
import AdminItemControls from '../components/Admin/AdminItemControls'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getFriendlyErrorMessage, requireChangedRows } from '../lib/adminErrors'
import { moveAndRenumber, persistSortOrder, setRowVisibility } from '../lib/adminOrdering'
import { buildStoryImportRows } from '../lib/storyImport'
import {
  invalidateStoriesCache,
  loadStories,
  type StoryKind,
  type StoryRecord,
} from '../lib/stories'
import { supabase } from '../utils/supabase'

const storyBucket = 'stories'

type FormState = {
  kind: StoryKind
  titleEn: string
  titleBn: string
  summaryEn: string
  summaryBn: string
  bodyEn: string
  bodyBn: string
  name: string
  nameBn: string
  roleEn: string
  roleBn: string
  badgesEn: string
  badgesBn: string
}

const emptyForm = (kind: StoryKind): FormState => ({
  kind,
  titleEn: '',
  titleBn: '',
  summaryEn: '',
  summaryBn: '',
  bodyEn: '',
  bodyBn: '',
  name: '',
  nameBn: '',
  roleEn: '',
  roleBn: '',
  badgesEn: '',
  badgesBn: '',
})

const toForm = (record: StoryRecord): FormState => ({
  kind: record.kind,
  titleEn: record.title_en,
  titleBn: record.title_bn ?? '',
  summaryEn: record.summary_en,
  summaryBn: record.summary_bn ?? '',
  bodyEn: record.body_en ?? '',
  bodyBn: record.body_bn ?? '',
  name: record.name ?? '',
  nameBn: record.name_bn ?? '',
  roleEn: record.role_en ?? '',
  roleBn: record.role_bn ?? '',
  badgesEn: record.badges_en ?? '',
  badgesBn: record.badges_bn ?? '',
})

const fieldClass =
  'w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-1.5 text-[0.86rem] font-semibold text-[#14324d]'
const orNull = (value: string) => value.trim() || null

const getStoragePathFromPublicUrl = (publicUrl: string | null) => {
  const marker = `/storage/v1/object/public/${storyBucket}/`
  const index = publicUrl?.indexOf(marker) ?? -1
  return publicUrl && index !== -1 ? publicUrl.slice(index + marker.length) : null
}

function AdminStories() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<StoryRecord[]>([])
  const [kind, setKind] = useState<StoryKind>('beneficiary')
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const editing = records.find((record) => record.id === editingId) ?? null
  const hasUnsavedChanges =
    form !== null &&
    (Boolean(imageFile) ||
      JSON.stringify(form) !== JSON.stringify(editing ? toForm(editing) : emptyForm(form.kind)))
  const visible = records.filter((record) => record.kind === kind)

  const refresh = async () => {
    setIsLoading(true)
    try {
      invalidateStoriesCache()
      setRecords(await loadStories())
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error as { message?: string }))
    }
    setIsLoading(false)
  }

  useEffect(() => {
    void refresh()
    // Load once when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((current) => (current ? { ...current, [field]: value } : current))

  const openForm = (record: StoryRecord | null) => {
    setSuccessMessage('')
    setErrorMessage('')
    setImageFile(null)
    setEditingId(record?.id ?? null)
    setForm(record ? toForm(record) : emptyForm(kind))
  }

  const closeForm = () => {
    if (hasUnsavedChanges && !window.confirm(t('admin.unsaved.leaveConfirmation'))) {
      return
    }
    setForm(null)
    setEditingId(null)
    setImageFile(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) {
      return
    }

    if (!form.titleEn.trim() || !form.summaryEn.trim()) {
      setErrorMessage(t('admin.stories.errors.required'))
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    let imageUrl = editing?.image_url ?? null
    let uploadedPath: string | null = null

    if (imageFile) {
      const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      uploadedPath = `${form.kind}/${Date.now()}.${extension}`
      const { error } = await supabase.storage
        .from(storyBucket)
        .upload(uploadedPath, imageFile, { contentType: imageFile.type })

      if (error) {
        setErrorMessage(getFriendlyErrorMessage(t, error))
        setIsSaving(false)
        return
      }
      imageUrl = supabase.storage.from(storyBucket).getPublicUrl(uploadedPath).data.publicUrl
    }

    const payload = {
      kind: form.kind,
      title_en: form.titleEn.trim(),
      title_bn: orNull(form.titleBn),
      summary_en: form.summaryEn.trim(),
      summary_bn: orNull(form.summaryBn),
      body_en: orNull(form.bodyEn),
      body_bn: orNull(form.bodyBn),
      name: orNull(form.name),
      name_bn: orNull(form.nameBn),
      role_en: orNull(form.roleEn),
      role_bn: orNull(form.roleBn),
      badges_en: orNull(form.badgesEn),
      badges_bn: orNull(form.badgesBn),
      image_url: imageUrl,
    }

    const error = requireChangedRows(
      editingId
        ? await supabase.from('stories').update(payload).eq('id', editingId).select('id')
        : await supabase
            .from('stories')
            .insert({ ...payload, sort_order: records.length + 1 })
            .select('id'),
    )

    if (error) {
      // Don't leave an orphaned photo behind when the save itself failed.
      if (uploadedPath) {
        await supabase.storage.from(storyBucket).remove([uploadedPath])
      }
      setErrorMessage(getFriendlyErrorMessage(t, error))
      setIsSaving(false)
      return
    }

    const previousPath = uploadedPath
      ? getStoragePathFromPublicUrl(editing?.image_url ?? null)
      : null
    if (previousPath) {
      await supabase.storage.from(storyBucket).remove([previousPath])
    }

    await refresh()
    setKind(form.kind)
    setForm(null)
    setEditingId(null)
    setImageFile(null)
    setSuccessMessage(
      t(editingId ? 'admin.stories.updated' : 'admin.stories.created', { title: payload.title_en }),
    )
    setIsSaving(false)
  }

  const handleImport = async () => {
    if (!window.confirm(t('admin.stories.importConfirm'))) {
      return
    }

    setIsImporting(true)
    setErrorMessage('')
    try {
      // The Bangla file is normally loaded only when a visitor picks Bangla.
      const [en, bn] = await Promise.all([
        import('../locales/en/common.json'),
        import('../locales/bn/common.json'),
      ])
      const rows = buildStoryImportRows(en.default, bn.default)
      const { error } = await supabase.from('stories').insert(rows)
      if (error) {
        throw error
      }
      await refresh()
      setSuccessMessage(t('admin.stories.imported', { count: rows.length }))
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error as { message?: string }))
    }
    setIsImporting(false)
  }

  const handleMove = async (record: StoryRecord, direction: -1 | 1) => {
    const { nextItems, changedRows } = moveAndRenumber(visible, record.id, direction)
    if (!changedRows.length) {
      return
    }

    const previous = records
    setBusyId(record.id)
    setRecords((current) => [...current.filter((item) => item.kind !== kind), ...nextItems])
    const error = await persistSortOrder('stories', changedRows)
    if (error) {
      setRecords(previous)
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateStoriesCache()
    }
    setBusyId(null)
  }

  const handleToggleVisibility = async (record: StoryRecord) => {
    setBusyId(record.id)
    const error = await setRowVisibility('stories', record.id, !record.is_active)
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateStoriesCache()
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, is_active: !item.is_active } : item,
        ),
      )
    }
    setBusyId(null)
  }

  const handleDelete = async (record: StoryRecord) => {
    if (!window.confirm(t('admin.stories.deleteConfirm', { title: record.title_en }))) {
      return
    }

    setBusyId(record.id)
    const error = requireChangedRows(
      await supabase.from('stories').delete().eq('id', record.id).select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      const imagePath = getStoragePathFromPublicUrl(record.image_url)
      if (imagePath) {
        await supabase.storage.from(storyBucket).remove([imagePath])
      }
      invalidateStoriesCache()
      setRecords((current) => current.filter((item) => item.id !== record.id))
      setSuccessMessage(t('admin.stories.deleted', { title: record.title_en }))
    }
    setBusyId(null)
  }

  const textField = (
    field: keyof Omit<FormState, 'kind'>,
    labelKey: string,
    options: { bangla?: boolean; rows?: number } = {},
  ) => {
    const common = {
      className: options.rows ? `${fieldClass} leading-[1.6]` : fieldClass,
      id: `story-${field}`,
      lang: options.bangla ? 'bn' : undefined,
      onChange: (event: { target: { value: string } }) => update(field, event.target.value),
      value: form?.[field] ?? '',
    }
    return (
      <label className={labelClass}>
        {t(labelKey)}
        {options.rows ? <textarea rows={options.rows} {...common} /> : <input {...common} />}
      </label>
    )
  }

  return (
    <AdminShellLayout
      description={t('admin.stories.description')}
      eyebrow={t('admin.stories.eyebrow')}
      hasUnsavedChanges={hasUnsavedChanges}
      title={t('admin.stories.title')}
    >
      {form ? (
        <form
          className="mt-8 rounded-[1.35rem] border border-[#9fc7da] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
          <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
            {editingId ? t('admin.stories.editTitle') : t('admin.stories.newTitle')}
          </h2>

          <fieldset className="mt-5 flex flex-wrap gap-4 text-[0.92rem] text-[#14324d]">
            <legend className="sr-only">{t('admin.stories.fields.kind')}</legend>
            {(['beneficiary', 'donor'] as const).map((option) => (
              <label className="flex items-center gap-2" key={option}>
                <input
                  checked={form.kind === option}
                  className="h-4 w-4 accent-[#115b82]"
                  name="story-kind"
                  onChange={() => update('kind', option)}
                  type="radio"
                />
                {t(`admin.stories.kinds.${option}`)}
              </label>
            ))}
          </fieldset>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {textField('titleEn', 'admin.stories.fields.titleEn')}
            {textField('titleBn', 'admin.stories.fields.titleBn', { bangla: true })}
            {textField('summaryEn', 'admin.stories.fields.summaryEn', { rows: 4 })}
            {textField('summaryBn', 'admin.stories.fields.summaryBn', { bangla: true, rows: 4 })}
            {textField('bodyEn', 'admin.stories.fields.bodyEn', { rows: 10 })}
            {textField('bodyBn', 'admin.stories.fields.bodyBn', { bangla: true, rows: 10 })}
            {textField('name', 'admin.stories.fields.name')}
            {textField('nameBn', 'admin.stories.fields.nameBn', { bangla: true })}
            {textField('roleEn', 'admin.stories.fields.roleEn')}
            {textField('roleBn', 'admin.stories.fields.roleBn', { bangla: true })}
            {textField('badgesEn', 'admin.stories.fields.badgesEn')}
            {textField('badgesBn', 'admin.stories.fields.badgesBn', { bangla: true })}
          </div>
          <p className="mt-2 text-[0.82rem] leading-[1.6] text-[#5d6d78]">
            {t('admin.stories.help')}
          </p>

          <div className="mt-5 grid gap-2">
            <span className="text-[0.86rem] font-semibold text-[#14324d]">
              {t('admin.stories.fields.image')}
            </span>
            <AdminImageInput
              alt={form.titleEn || t('admin.stories.fields.image')}
              currentImageUrl={editing?.image_url}
              file={imageFile}
              inputClassName="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[0.95rem] text-[#14324d] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef6fb] file:px-3 file:py-2 file:text-[0.8rem] file:font-semibold file:text-[#115b82]"
              maxDimension={1400}
              onChange={(file) => {
                setErrorMessage('')
                setImageFile(file)
              }}
              onError={setErrorMessage}
              previewClassName="h-36 w-full max-w-[14rem] object-cover"
            />
          </div>

          {errorMessage ? (
            <p
              className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-[#13703e] px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? t('admin.stories.saving') : t('admin.stories.save')}
            </button>
            <button
              className="rounded-full border border-[#dbe7ee] bg-white px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:bg-[#f7fbfd]"
              disabled={isSaving}
              onClick={closeForm}
              type="button"
            >
              {t('admin.stories.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#13703e] px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
            onClick={() => openForm(null)}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
              add
            </span>
            {t('admin.stories.new')}
          </button>
          {!isLoading && !records.length ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] bg-white px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
              disabled={isImporting}
              onClick={() => void handleImport()}
              type="button"
            >
              {isImporting ? t('admin.stories.importing') : t('admin.stories.import')}
            </button>
          ) : null}
        </div>
      )}

      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t('admin.stories.fields.kind')}
        >
          {(['beneficiary', 'donor'] as const).map((option) => (
            <button
              aria-pressed={kind === option}
              className={`rounded-full border px-4 py-2 text-[0.82rem] font-semibold transition ${
                kind === option
                  ? 'border-[#115b82] bg-[#115b82] text-white'
                  : 'border-[#dbe7ee] bg-white text-[#4f6473] hover:border-[#bfd5e4]'
              }`}
              key={option}
              onClick={() => setKind(option)}
              type="button"
            >
              {t(`admin.stories.tabs.${option}`)} (
              {records.filter((record) => record.kind === option).length})
            </button>
          ))}
        </div>
        <p className="mt-4 text-[0.92rem] leading-[1.7] text-[#5d6d78]">
          {t(`admin.stories.where.${kind}`)}
        </p>

        {!form && errorMessage ? (
          <p
            className="mt-5 rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]"
            role="alert"
          >
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p
            className="mt-5 rounded-[1rem] border border-[#cde7d8] bg-[#f5fbf7] px-4 py-3 text-sm leading-[1.7] text-[#13703e]"
            role="status"
          >
            {successMessage}
          </p>
        ) : null}

        {isLoading ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.stories.loading')}
          </p>
        ) : !visible.length ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.stories.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {visible.map((record, index) => {
              const isShownAsFeatured =
                record.kind === 'beneficiary' &&
                record.id === visible.find((item) => item.is_active)?.id
              return (
                <li
                  className="grid gap-5 rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5 md:grid-cols-[7rem_1fr]"
                  key={record.id}
                >
                  {record.image_url ? (
                    <img
                      alt=""
                      className="aspect-square w-full rounded-[0.8rem] object-cover"
                      decoding="async"
                      loading="lazy"
                      src={record.image_url}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-square w-full rounded-[0.8rem] bg-[linear-gradient(135deg,#115b82,#13703e)]"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-[1.2rem] leading-tight text-[#14324d]">
                        {record.title_en}
                      </p>
                      {isShownAsFeatured ? (
                        <span className="rounded-full border border-[#cde7d8] bg-[#f5fbf7] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#13703e]">
                          {t('admin.stories.featured')}
                        </span>
                      ) : null}
                      {!record.is_active ? (
                        <span className="rounded-full border border-[#dbe7ee] bg-[#f6f9fb] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#4f6473]">
                          {t('admin.stories.hidden')}
                        </span>
                      ) : null}
                      {!record.summary_bn ? (
                        <span className="rounded-full border border-[#f1dfb8] bg-[#fffaf0] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#8a5a00]">
                          {t('admin.stories.noBangla')}
                        </span>
                      ) : null}
                    </div>
                    {record.name ? (
                      <p className="mt-1 text-[0.88rem] text-[#5d6d78]">
                        {[record.name, record.role_en].filter(Boolean).join(' · ')}
                      </p>
                    ) : null}
                    <p className="mt-3 line-clamp-3 text-[0.95rem] leading-[1.7] text-[#4f6170]">
                      {record.summary_en}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <AdminItemControls
                        canMoveDown={index < visible.length - 1}
                        canMoveUp={index > 0}
                        isActive={record.is_active}
                        isBusy={busyId === record.id}
                        onMove={(direction) => void handleMove(record, direction)}
                        onToggleVisibility={() => void handleToggleVisibility(record)}
                      />
                      <button
                        className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                        onClick={() => openForm(record)}
                        type="button"
                      >
                        {t('admin.stories.edit')}
                      </button>
                      <button
                        className="inline-flex h-9 items-center rounded-full px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:opacity-60"
                        disabled={busyId === record.id}
                        onClick={() => void handleDelete(record)}
                        type="button"
                      >
                        {t('admin.stories.delete')}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </AdminShellLayout>
  )
}

export default AdminStories
