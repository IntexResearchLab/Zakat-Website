import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AdminItemControls from '../components/Admin/AdminItemControls'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getFriendlyErrorMessage, requireChangedRows } from '../lib/adminErrors'
import { moveAndRenumber, persistSortOrder, setRowVisibility } from '../lib/adminOrdering'
import { buildImportRows } from '../lib/testimonialImport'
import {
  invalidateTestimonialsCache,
  loadTestimonials,
  type TestimonialKind,
  type TestimonialRecord,
} from '../lib/testimonials'
import { supabase } from '../utils/supabase'

type FormState = {
  kind: TestimonialKind
  name: string
  nameBn: string
  roleEn: string
  roleBn: string
  locationEn: string
  locationBn: string
  quoteEn: string
  quoteBn: string
  headlineEn: string
  headlineBn: string
  tagsEn: string
  tagsBn: string
  showOnHome: boolean
}

const emptyForm = (kind: TestimonialKind): FormState => ({
  kind,
  name: '',
  nameBn: '',
  roleEn: '',
  roleBn: '',
  locationEn: '',
  locationBn: '',
  quoteEn: '',
  quoteBn: '',
  headlineEn: '',
  headlineBn: '',
  tagsEn: '',
  tagsBn: '',
  showOnHome: false,
})

const toForm = (record: TestimonialRecord): FormState => ({
  kind: record.kind,
  name: record.name,
  nameBn: record.name_bn ?? '',
  roleEn: record.role_en ?? '',
  roleBn: record.role_bn ?? '',
  locationEn: record.location_en ?? '',
  locationBn: record.location_bn ?? '',
  quoteEn: record.quote_en,
  quoteBn: record.quote_bn ?? '',
  headlineEn: record.headline_en ?? '',
  headlineBn: record.headline_bn ?? '',
  tagsEn: record.tags_en ?? '',
  tagsBn: record.tags_bn ?? '',
  showOnHome: record.show_on_home,
})

const fieldClass =
  'w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-1.5 text-[0.86rem] font-semibold text-[#14324d]'
const orNull = (value: string) => value.trim() || null

function AdminTestimonials() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<TestimonialRecord[]>([])
  const [kind, setKind] = useState<TestimonialKind>('beneficiary')
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const editing = records.find((record) => record.id === editingId) ?? null
  const hasUnsavedChanges =
    form !== null &&
    JSON.stringify(form) !== JSON.stringify(editing ? toForm(editing) : emptyForm(form.kind))
  const visible = records.filter((record) => record.kind === kind)

  const refresh = async () => {
    setIsLoading(true)
    try {
      invalidateTestimonialsCache()
      setRecords(await loadTestimonials())
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

  const closeForm = () => {
    if (hasUnsavedChanges && !window.confirm(t('admin.unsaved.leaveConfirmation'))) {
      return
    }
    setForm(null)
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form) {
      return
    }

    if (!form.name.trim() || !form.quoteEn.trim()) {
      setErrorMessage(t('admin.testimonials.errors.required'))
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    const payload = {
      kind: form.kind,
      name: form.name.trim(),
      name_bn: orNull(form.nameBn),
      role_en: orNull(form.roleEn),
      role_bn: orNull(form.roleBn),
      location_en: orNull(form.locationEn),
      location_bn: orNull(form.locationBn),
      quote_en: form.quoteEn.trim(),
      quote_bn: orNull(form.quoteBn),
      headline_en: orNull(form.headlineEn),
      headline_bn: orNull(form.headlineBn),
      tags_en: orNull(form.tagsEn),
      tags_bn: orNull(form.tagsBn),
      show_on_home: form.showOnHome,
    }

    const error = requireChangedRows(
      editingId
        ? await supabase.from('testimonials').update(payload).eq('id', editingId).select('id')
        : await supabase
            .from('testimonials')
            .insert({ ...payload, sort_order: records.length + 1 })
            .select('id'),
    )

    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      await refresh()
      setKind(form.kind)
      setForm(null)
      setEditingId(null)
      setSuccessMessage(
        t(editingId ? 'admin.testimonials.updated' : 'admin.testimonials.created', {
          name: payload.name,
        }),
      )
    }
    setIsSaving(false)
  }

  const handleImport = async () => {
    if (!window.confirm(t('admin.testimonials.importConfirm'))) {
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
      const rows = buildImportRows(en.default, bn.default)
      const { error } = await supabase.from('testimonials').insert(rows)
      if (error) {
        throw error
      }
      await refresh()
      setSuccessMessage(t('admin.testimonials.imported', { count: rows.length }))
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error as { message?: string }))
    }
    setIsImporting(false)
  }

  const handleMove = async (record: TestimonialRecord, direction: -1 | 1) => {
    const { nextItems, changedRows } = moveAndRenumber(visible, record.id, direction)
    if (!changedRows.length) {
      return
    }

    const previous = records
    setBusyId(record.id)
    setRecords((current) => [...current.filter((item) => item.kind !== kind), ...nextItems])
    const error = await persistSortOrder('testimonials', changedRows)
    if (error) {
      setRecords(previous)
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateTestimonialsCache()
    }
    setBusyId(null)
  }

  const handleToggleVisibility = async (record: TestimonialRecord) => {
    setBusyId(record.id)
    const error = await setRowVisibility('testimonials', record.id, !record.is_active)
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateTestimonialsCache()
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, is_active: !item.is_active } : item,
        ),
      )
    }
    setBusyId(null)
  }

  const handleToggleHome = async (record: TestimonialRecord) => {
    setBusyId(record.id)
    const error = requireChangedRows(
      await supabase
        .from('testimonials')
        .update({ show_on_home: !record.show_on_home })
        .eq('id', record.id)
        .select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateTestimonialsCache()
      setRecords((current) =>
        current.map((item) =>
          item.id === record.id ? { ...item, show_on_home: !item.show_on_home } : item,
        ),
      )
    }
    setBusyId(null)
  }

  const handleDelete = async (record: TestimonialRecord) => {
    if (!window.confirm(t('admin.testimonials.deleteConfirm', { name: record.name }))) {
      return
    }

    setBusyId(record.id)
    const error = requireChangedRows(
      await supabase.from('testimonials').delete().eq('id', record.id).select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateTestimonialsCache()
      setRecords((current) => current.filter((item) => item.id !== record.id))
      setSuccessMessage(t('admin.testimonials.deleted', { name: record.name }))
    }
    setBusyId(null)
  }

  const textField = (
    field: keyof FormState,
    labelKey: string,
    options: { bangla?: boolean; area?: boolean } = {},
  ) => {
    const value = form?.[field] as string
    const common = {
      className: options.area ? `${fieldClass} min-h-[6.5rem]` : fieldClass,
      id: `testimonial-${field}`,
      lang: options.bangla ? 'bn' : undefined,
      onChange: (event: { target: { value: string } }) =>
        update(field, event.target.value as never),
      value,
    }
    return (
      <label className={labelClass}>
        {t(labelKey)}
        {options.area ? <textarea {...common} /> : <input {...common} />}
      </label>
    )
  }

  return (
    <AdminShellLayout
      description={t('admin.testimonials.description')}
      eyebrow={t('admin.testimonials.eyebrow')}
      hasUnsavedChanges={hasUnsavedChanges}
      title={t('admin.testimonials.title')}
    >
      {form ? (
        <form
          className="mt-8 rounded-[1.35rem] border border-[#9fc7da] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
          <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
            {editingId ? t('admin.testimonials.editTitle') : t('admin.testimonials.newTitle')}
          </h2>

          <fieldset className="mt-5 flex flex-wrap gap-4 text-[0.92rem] text-[#14324d]">
            <legend className="sr-only">{t('admin.testimonials.fields.kind')}</legend>
            {(['beneficiary', 'donor'] as const).map((option) => (
              <label className="flex items-center gap-2" key={option}>
                <input
                  checked={form.kind === option}
                  className="h-4 w-4 accent-[#115b82]"
                  name="testimonial-kind"
                  onChange={() => update('kind', option)}
                  type="radio"
                />
                {t(`admin.testimonials.kinds.${option}`)}
              </label>
            ))}
          </fieldset>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {textField('name', 'admin.testimonials.fields.name')}
            {textField('nameBn', 'admin.testimonials.fields.nameBn', { bangla: true })}
            {textField('roleEn', 'admin.testimonials.fields.roleEn')}
            {textField('roleBn', 'admin.testimonials.fields.roleBn', { bangla: true })}
            {textField('locationEn', 'admin.testimonials.fields.locationEn')}
            {textField('locationBn', 'admin.testimonials.fields.locationBn', { bangla: true })}
            {textField('quoteEn', 'admin.testimonials.fields.quoteEn', { area: true })}
            {textField('quoteBn', 'admin.testimonials.fields.quoteBn', {
              area: true,
              bangla: true,
            })}
            {textField('headlineEn', 'admin.testimonials.fields.headlineEn')}
            {textField('headlineBn', 'admin.testimonials.fields.headlineBn', { bangla: true })}
            {textField('tagsEn', 'admin.testimonials.fields.tagsEn')}
            {textField('tagsBn', 'admin.testimonials.fields.tagsBn', { bangla: true })}
          </div>
          <p className="mt-2 text-[0.82rem] text-[#5d6d78]">
            {t('admin.testimonials.optionalHelp')}
          </p>

          <label className="mt-5 flex items-center gap-3 text-[0.92rem] text-[#14324d]">
            <input
              checked={form.showOnHome}
              className="h-4 w-4 accent-[#13703e]"
              id="testimonial-home"
              onChange={(event) => update('showOnHome', event.target.checked)}
              type="checkbox"
            />
            {t('admin.testimonials.fields.showOnHome')}
          </label>

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
              {isSaving ? t('admin.testimonials.saving') : t('admin.testimonials.save')}
            </button>
            <button
              className="rounded-full border border-[#dbe7ee] bg-white px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:bg-[#f7fbfd]"
              disabled={isSaving}
              onClick={closeForm}
              type="button"
            >
              {t('admin.testimonials.cancel')}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#13703e] px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
            onClick={() => {
              setSuccessMessage('')
              setErrorMessage('')
              setEditingId(null)
              setForm(emptyForm(kind))
            }}
            type="button"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
              add
            </span>
            {t('admin.testimonials.new')}
          </button>
          {!isLoading && !records.length ? (
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] bg-white px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
              disabled={isImporting}
              onClick={() => void handleImport()}
              type="button"
            >
              {isImporting ? t('admin.testimonials.importing') : t('admin.testimonials.import')}
            </button>
          ) : null}
        </div>
      )}

      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t('admin.testimonials.fields.kind')}
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
              {t(`admin.testimonials.tabs.${option}`)} (
              {records.filter((record) => record.kind === option).length})
            </button>
          ))}
        </div>
        <p className="mt-4 text-[0.92rem] leading-[1.7] text-[#5d6d78]">
          {t(`admin.testimonials.where.${kind}`)}
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
            {t('admin.testimonials.loading')}
          </p>
        ) : !visible.length ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.testimonials.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {visible.map((record, index) => (
              <li
                className="rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5"
                key={record.id}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-serif text-[1.2rem] leading-tight text-[#14324d]">
                    {record.name}
                  </p>
                  {!record.is_active ? (
                    <span className="rounded-full border border-[#dbe7ee] bg-[#f6f9fb] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#4f6473]">
                      {t('admin.testimonials.hidden')}
                    </span>
                  ) : null}
                  {record.show_on_home ? (
                    <span className="rounded-full border border-[#cde7d8] bg-[#f5fbf7] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#13703e]">
                      {t('admin.testimonials.onHome')}
                    </span>
                  ) : null}
                  {!record.quote_bn ? (
                    <span className="rounded-full border border-[#f1dfb8] bg-[#fffaf0] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#8a5a00]">
                      {t('admin.testimonials.noBangla')}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-[0.88rem] text-[#5d6d78]">
                  {[record.role_en, record.location_en].filter(Boolean).join(', ')}
                </p>
                <p className="mt-3 font-serif text-[1.02rem] italic leading-[1.7] text-[#27465f]">
                  “{record.quote_en}”
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
                    className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
                    disabled={busyId === record.id}
                    onClick={() => void handleToggleHome(record)}
                    type="button"
                  >
                    {record.show_on_home
                      ? t('admin.testimonials.removeFromHome')
                      : t('admin.testimonials.addToHome')}
                  </button>
                  <button
                    className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                    onClick={() => {
                      setSuccessMessage('')
                      setErrorMessage('')
                      setEditingId(record.id)
                      setForm(toForm(record))
                    }}
                    type="button"
                  >
                    {t('admin.testimonials.edit')}
                  </button>
                  <button
                    className="inline-flex h-9 items-center rounded-full px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:opacity-60"
                    disabled={busyId === record.id}
                    onClick={() => void handleDelete(record)}
                    type="button"
                  >
                    {t('admin.testimonials.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShellLayout>
  )
}

export default AdminTestimonials
