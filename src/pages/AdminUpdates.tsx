import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AdminPhotoListInput from '../components/Admin/AdminPhotoListInput'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getGalleryCategoryLabel } from '../components/Gallery/data'
import { getFriendlyErrorMessage, requireChangedRows } from '../lib/adminErrors'
import { releasePhotoPreviews, savedPhotos, type AdminPhoto } from '../lib/adminPhotos'
import {
  getUpdatePhotoPath,
  getYouTubeId,
  getYouTubeWatchUrl,
  invalidateUpdatesCache,
  loadUpdates,
  maxUpdatePhotos,
  slugify,
  slugPattern,
  todayInDhaka,
  updatePrograms,
  updatesBucket,
  type UpdateRecord,
} from '../lib/updates'
import { supabase } from '../utils/supabase'

type UpdateForm = {
  slug: string
  titleEn: string
  titleBn: string
  bodyEn: string
  bodyBn: string
  publishedOn: string
  program: string
  youtubeUrl: string
}

const newForm = (): UpdateForm => ({
  slug: '',
  titleEn: '',
  titleBn: '',
  bodyEn: '',
  bodyBn: '',
  publishedOn: todayInDhaka(),
  program: '',
  youtubeUrl: '',
})

const fieldClass =
  'w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-1.5 text-[0.86rem] font-semibold text-[#14324d]'
const hintClass = 'text-[0.82rem] font-normal text-[#5d6d78]'

const toForm = (update: UpdateRecord): UpdateForm => ({
  slug: update.slug,
  titleEn: update.title_en,
  titleBn: update.title_bn ?? '',
  bodyEn: update.body_en,
  bodyBn: update.body_bn ?? '',
  publishedOn: update.published_on,
  program: update.program ?? '',
  youtubeUrl: update.youtube_url ?? '',
})

const removeStoredPhotos = async (urls: string[]) => {
  const paths = urls.map(getUpdatePhotoPath).filter((path): path is string => Boolean(path))
  if (paths.length) {
    const { error } = await supabase.storage.from(updatesBucket).remove(paths)
    // The post itself is already saved, so a leftover file is only logged.
    if (error) {
      console.error('[updates] could not remove photos', error)
    }
  }
}

function AdminUpdates() {
  const { t } = useTranslation()
  const formRef = useRef<HTMLFormElement | null>(null)
  const [updates, setUpdates] = useState<UpdateRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<UpdateForm>(newForm)
  const [baselineForm, setBaselineForm] = useState<UpdateForm>(newForm)
  const [photos, setPhotos] = useState<AdminPhoto[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const editingUpdate = updates.find((item) => item.id === editingId) ?? null
  const photosChanged =
    photos.map((photo) => photo.key).join('\n') !== (editingUpdate?.photos ?? []).join('\n')
  const hasUnsavedChanges =
    isFormOpen && (photosChanged || JSON.stringify(form) !== JSON.stringify(baselineForm))
  const programOptions = useMemo(
    () =>
      updatePrograms.map((program) => ({ value: program, label: getGalleryCategoryLabel(t, program) })),
    [t],
  )

  // Release photo previews that were never saved when the admin leaves the page.
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  useEffect(() => () => releasePhotoPreviews(photosRef.current), [])

  // Bring the form into view when it opens, for example after pressing Edit far down the list.
  useEffect(() => {
    if (isFormOpen) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [isFormOpen, editingId])

  const refresh = async () => {
    setIsLoading(true)
    try {
      invalidateUpdatesCache()
      setUpdates(await loadUpdates())
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

  const update = (field: keyof UpdateForm) => (value: string) =>
    setForm((current) => {
      const next = { ...current, [field]: value }
      // The web address follows the English title until it is edited by hand.
      if (field === 'titleEn' && !slugTouched && !editingId) {
        next.slug = slugify(value)
      }
      return next
    })

  const replacePhotos = (next: AdminPhoto[]) => {
    releasePhotoPreviews(photos)
    setPhotos(next)
  }

  const openForm = (next: UpdateForm, id: string | null, nextPhotos: AdminPhoto[]) => {
    if (hasUnsavedChanges && !window.confirm(t('admin.unsaved.discardConfirmation'))) {
      return
    }
    setForm(next)
    setBaselineForm(next)
    setEditingId(id)
    setSlugTouched(Boolean(id))
    replacePhotos(nextPhotos)
    setErrorMessage('')
    setSuccessMessage('')
    setIsFormOpen(true)
  }

  const openNew = () => openForm(newForm(), null, [])

  const openEdit = (item: UpdateRecord) => openForm(toForm(item), item.id, savedPhotos(item.photos))

  const resetForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    replacePhotos([])
  }

  const closeForm = () => {
    if (hasUnsavedChanges && !window.confirm(t('admin.unsaved.leaveConfirmation'))) {
      return
    }
    resetForm()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const slug = form.slug.trim()
    const youtubeLink = form.youtubeUrl.trim()
    const videoId = youtubeLink ? getYouTubeId(youtubeLink) : null

    if (!form.titleEn.trim() || !form.bodyEn.trim()) {
      setErrorMessage(t('admin.updates.errors.required'))
      return
    }
    if (!slugPattern.test(slug) || slug.length > 80) {
      setErrorMessage(t('admin.updates.errors.slug'))
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.publishedOn)) {
      setErrorMessage(t('admin.updates.errors.date'))
      return
    }
    if (youtubeLink && !videoId) {
      setErrorMessage(t('admin.updates.errors.youtube'))
      return
    }
    if (photos.length > maxUpdatePhotos) {
      setErrorMessage(t('admin.updates.photos.tooMany', { max: maxUpdatePhotos }))
      return
    }

    setIsSaving(true)

    // Upload new photos first, keeping the order the admin chose.
    const uploadedPaths: string[] = []
    const photoUrls: string[] = []
    const stamp = Date.now()

    for (const [index, photo] of photos.entries()) {
      if (photo.kind === 'saved') {
        photoUrls.push(photo.url)
        continue
      }

      const extension = photo.file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${slug}/${stamp}-${index + 1}.${extension}`
      const { error } = await supabase.storage
        .from(updatesBucket)
        .upload(path, photo.file, { contentType: photo.file.type, cacheControl: '3600' })

      if (error) {
        // Don't leave half of a set of photos behind.
        if (uploadedPaths.length) {
          await supabase.storage.from(updatesBucket).remove(uploadedPaths)
        }
        setErrorMessage(getFriendlyErrorMessage(t, error))
        setIsSaving(false)
        return
      }

      uploadedPaths.push(path)
      photoUrls.push(supabase.storage.from(updatesBucket).getPublicUrl(path).data.publicUrl)
    }

    const payload = {
      slug,
      title_en: form.titleEn.trim(),
      title_bn: form.titleBn.trim() || null,
      body_en: form.bodyEn.trim(),
      body_bn: form.bodyBn.trim() || null,
      published_on: form.publishedOn,
      program: form.program || null,
      photos: photoUrls,
      youtube_url: videoId ? getYouTubeWatchUrl(videoId) : null,
    }

    const error = requireChangedRows(
      editingId
        ? await supabase.from('updates').update(payload).eq('id', editingId).select('id')
        : await supabase.from('updates').insert(payload).select('id'),
    )

    if (error) {
      // Don't leave orphaned photos behind when the save itself failed.
      if (uploadedPaths.length) {
        await supabase.storage.from(updatesBucket).remove(uploadedPaths)
      }
      setErrorMessage(
        error.code === '23505' ? t('admin.updates.errors.slugTaken') : getFriendlyErrorMessage(t, error),
      )
      setIsSaving(false)
      return
    }

    // Photos that were removed or replaced are deleted from storage once the post no longer uses them.
    await removeStoredPhotos((editingUpdate?.photos ?? []).filter((url) => !photoUrls.includes(url)))

    const wasEditing = Boolean(editingId)
    setPhotos([])
    releasePhotoPreviews(photos)
    setIsFormOpen(false)
    setEditingId(null)
    await refresh()
    setSuccessMessage(
      t(wasEditing ? 'admin.updates.updated' : 'admin.updates.created', { title: payload.title_en }),
    )
    setIsSaving(false)
  }

  const handleTogglePublished = async (item: UpdateRecord) => {
    setBusyId(item.id)
    setErrorMessage('')
    setSuccessMessage('')
    const error = requireChangedRows(
      await supabase
        .from('updates')
        .update({ is_published: !item.is_published })
        .eq('id', item.id)
        .select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateUpdatesCache()
      setUpdates((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, is_published: !entry.is_published } : entry,
        ),
      )
      setSuccessMessage(
        t(item.is_published ? 'admin.updates.hiddenSuccess' : 'admin.updates.publishedSuccess', {
          title: item.title_en,
        }),
      )
    }
    setBusyId(null)
  }

  const handleDelete = async (item: UpdateRecord) => {
    if (!window.confirm(t('admin.updates.deleteConfirm', { title: item.title_en }))) {
      return
    }

    setBusyId(item.id)
    setErrorMessage('')
    setSuccessMessage('')
    const error = requireChangedRows(
      await supabase.from('updates').delete().eq('id', item.id).select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      await removeStoredPhotos(item.photos)
      if (editingId === item.id) {
        resetForm()
      }
      invalidateUpdatesCache()
      setUpdates((current) => current.filter((entry) => entry.id !== item.id))
      setSuccessMessage(t('admin.updates.deleted', { title: item.title_en }))
    }
    setBusyId(null)
  }

  const formatAdminDate = (value: string) =>
    new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <AdminShellLayout
      description={t('admin.updates.description')}
      eyebrow={t('admin.updates.eyebrow')}
      hasUnsavedChanges={hasUnsavedChanges}
      title={t('admin.updates.title')}
    >
      {!isFormOpen ? (
        <button
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#13703e] px-6 py-3 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35]"
          onClick={openNew}
          type="button"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[1.1rem]">
            add
          </span>
          {t('admin.updates.new')}
        </button>
      ) : (
        <form
          className="mt-8 scroll-mt-24 rounded-[1.35rem] border border-[#9fc7da] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)] lg:scroll-mt-6"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
          ref={formRef}
        >
          <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
            {editingId ? t('admin.updates.editTitle') : t('admin.updates.newTitle')}
          </h2>
          <p className="mt-3 text-[0.94rem] leading-[1.7] text-[#5d6d78]">
            {t('admin.updates.formIntro')}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              {t('admin.updates.fields.titleEn')}
              <input
                className={fieldClass}
                id="update-title-en"
                maxLength={160}
                onChange={(e) => update('titleEn')(e.target.value)}
                value={form.titleEn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.updates.fields.titleBn')}
              <input
                className={fieldClass}
                id="update-title-bn"
                lang="bn"
                maxLength={160}
                onChange={(e) => update('titleBn')(e.target.value)}
                value={form.titleBn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.updates.fields.bodyEn')}
              <textarea
                className={`${fieldClass} min-h-[9rem]`}
                id="update-body-en"
                onChange={(e) => update('bodyEn')(e.target.value)}
                value={form.bodyEn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.updates.fields.bodyBn')}
              <textarea
                className={`${fieldClass} min-h-[9rem]`}
                id="update-body-bn"
                lang="bn"
                onChange={(e) => update('bodyBn')(e.target.value)}
                value={form.bodyBn}
              />
            </label>
            <p className={`${hintClass} md:col-span-2`}>{t('admin.updates.bodyHelp')}</p>
            <label className={labelClass}>
              {t('admin.updates.fields.publishedOn')}
              <input
                className={fieldClass}
                id="update-date"
                onChange={(e) => update('publishedOn')(e.target.value)}
                type="date"
                value={form.publishedOn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.updates.fields.program')}
              <select
                className={fieldClass}
                id="update-program"
                onChange={(e) => update('program')(e.target.value)}
                value={form.program}
              >
                <option value="">{t('admin.updates.noProgram')}</option>
                {programOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              {t('admin.updates.fields.youtubeUrl')}
              <input
                className={fieldClass}
                id="update-youtube"
                inputMode="url"
                onChange={(e) => update('youtubeUrl')(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                type="url"
                value={form.youtubeUrl}
              />
              <span className={hintClass}>{t('admin.updates.youtubeHelp')}</span>
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              {t('admin.updates.fields.slug')}
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[0.9rem] font-normal text-[#5d6d78]">/updates/</span>
                <input
                  className={`${fieldClass} min-w-0`}
                  id="update-slug"
                  maxLength={80}
                  onChange={(e) => {
                    setSlugTouched(true)
                    update('slug')(e.target.value.toLowerCase())
                  }}
                  value={form.slug}
                />
              </span>
              <span className={hintClass}>{t('admin.updates.slugHelp')}</span>
            </label>
          </div>

          <div className="mt-5 grid gap-2">
            <span className="text-[0.86rem] font-semibold text-[#14324d]">
              {t('admin.updates.fields.photos')}
            </span>
            <AdminPhotoListInput
              alt={form.titleEn || t('admin.updates.fields.photos')}
              maxDimension={2000}
              maxPhotos={maxUpdatePhotos}
              onChange={(next) => {
                setErrorMessage('')
                setPhotos(next)
              }}
              onError={setErrorMessage}
              photos={photos}
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
              {isSaving ? t('admin.updates.saving') : t('admin.updates.save')}
            </button>
            <button
              className="rounded-full border border-[#dbe7ee] bg-white px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:bg-[#f7fbfd]"
              disabled={isSaving}
              onClick={closeForm}
              type="button"
            >
              {t('admin.updates.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
          {t('admin.updates.listTitle')}
        </h2>
        <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#5d6d78]">
          {t('admin.updates.listIntro')}
        </p>

        {!isFormOpen && errorMessage ? (
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
            {t('admin.updates.loading')}
          </p>
        ) : !updates.length ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.updates.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {updates.map((item) => (
              <li
                className={`grid gap-5 rounded-[1.1rem] border p-5 md:grid-cols-[9rem_1fr] ${
                  item.is_published
                    ? 'border-[#edf3f7] bg-[#fbfdff]'
                    : 'border-dashed border-[#d6dee4] bg-[#f5f7f9]'
                }`}
                key={item.id}
              >
                {item.photos[0] ? (
                  <img
                    alt=""
                    className={`aspect-[4/3] w-full rounded-[0.8rem] object-cover ${
                      item.is_published ? '' : 'opacity-50 grayscale'
                    }`}
                    decoding="async"
                    loading="lazy"
                    src={item.photos[0]}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="aspect-[4/3] w-full rounded-[0.8rem] bg-[linear-gradient(135deg,#115b82,#13703e)]"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                      {item.title_en}
                    </p>
                    <span className="rounded-full border border-[#dbe7ee] bg-[#f6f9fb] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#4f6473]">
                      {item.is_published
                        ? t('admin.updates.state.published')
                        : t('admin.updates.state.hidden')}
                    </span>
                    {!item.title_bn?.trim() ? (
                      <span className="rounded-full bg-[#fff6e5] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#8a5a00]">
                        {t('admin.updates.noBangla')}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 break-all font-mono text-[0.8rem] text-[#5d6d78]">
                    /updates/{item.slug}
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.85rem] text-[#5d6d78]">
                    <span>{formatAdminDate(item.published_on)}</span>
                    {item.program ? <span>{getGalleryCategoryLabel(t, item.program)}</span> : null}
                    <span>{t('admin.updates.photoCount', { count: item.photos.length })}</span>
                    {item.youtube_url ? <span>{t('admin.updates.hasVideo')}</span> : null}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {item.is_published ? (
                      <a
                        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                        href={`/updates/${item.slug}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                          open_in_new
                        </span>
                        {t('admin.updates.view')}
                      </a>
                    ) : null}
                    <button
                      className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
                      disabled={busyId === item.id}
                      onClick={() => void handleTogglePublished(item)}
                      type="button"
                    >
                      {item.is_published ? t('admin.updates.hide') : t('admin.updates.publish')}
                    </button>
                    <button
                      className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd] disabled:opacity-60"
                      disabled={isSaving}
                      onClick={() => openEdit(item)}
                      type="button"
                    >
                      {t('admin.updates.edit')}
                    </button>
                    <button
                      className="inline-flex h-9 items-center rounded-full px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:opacity-60"
                      disabled={busyId === item.id || isSaving}
                      onClick={() => void handleDelete(item)}
                      type="button"
                    >
                      {t('admin.updates.delete')}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShellLayout>
  )
}

export default AdminUpdates
