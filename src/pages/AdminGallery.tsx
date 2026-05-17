import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { getGalleryCategoryLabel, getGalleryFilters } from '../components/Gallery/data'
import {
  invalidateGalleryItemsCache,
  type GalleryRecord,
  type GallerySpan,
} from '../lib/galleryItems'
import { supabase } from '../utils/supabase'

type GalleryForm = {
  filterId: string
  title: string
  description: string
  story: string
  location: string
  year: string
  span: GallerySpan
  sortOrder: string
}

const initialFormState: GalleryForm = {
  filterId: 'education',
  title: '',
  description: '',
  story: '',
  location: '',
  year: '',
  span: 'medium',
  sortOrder: '',
}

const galleryBucket = import.meta.env.VITE_SUPABASE_GALLERY_BUCKET || 'gallery'

const getFileExtension = (fileName: string) => {
  const segments = fileName.split('.')
  return segments.length > 1 ? segments.pop()?.toLowerCase() ?? '' : ''
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const buildImagePath = (filterId: string, title: string, fileName: string) => {
  const extension = getFileExtension(fileName)
  const safeTitle = slugify(title) || 'gallery-item'
  return `items/${filterId}/${Date.now()}-${safeTitle}${extension ? `.${extension}` : ''}`
}

const getStoragePathFromPublicUrl = (publicUrl: string | null) => {
  if (!publicUrl) {
    return null
  }

  const marker = `/storage/v1/object/public/${galleryBucket}/`
  const markerIndex = publicUrl.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  return publicUrl.slice(markerIndex + marker.length)
}

function AdminGallery() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GalleryRecord[]>([])
  const [formState, setFormState] = useState<GalleryForm>(initialFormState)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const filters = useMemo(
    () => getGalleryFilters(t).filter((filter) => filter.id !== 'all'),
    [t],
  )
  const galleryCount = items.length
  const editingItem = useMemo(
    () => items.find((item) => item.id === editingId) ?? null,
    [editingId, items],
  )

  const loadItems = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setItems((data ?? []) as GalleryRecord[])
    setIsLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialItems = async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (!isMounted) {
        return
      }

      if (error) {
        setErrorMessage(error.message)
        setIsLoading(false)
        return
      }

      setItems((data ?? []) as GalleryRecord[])
      setIsLoading(false)
    }

    void loadInitialItems()

    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setFormState(initialFormState)
    setImageFile(null)
    setEditingId(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleFieldChange = (field: keyof GalleryForm, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleEdit = (item: GalleryRecord) => {
    setEditingId(item.id)
    setErrorMessage('')
    setSuccessMessage('')
    setImageFile(null)
    setFormState({
      filterId: item.filter_id,
      title: item.title,
      description: item.description,
      story: item.story,
      location: item.location,
      year: item.year,
      span: item.span,
      sortOrder: String(item.sort_order),
    })
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleDelete = async (item: GalleryRecord) => {
    const shouldDelete = window.confirm(
      t('admin.gallery.deleteConfirmation', { title: item.title }),
    )

    if (!shouldDelete) {
      return
    }

    setDeletingId(item.id)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await supabase.from('gallery_items').delete().eq('id', item.id)

    if (error) {
      setErrorMessage(error.message)
      setDeletingId(null)
      return
    }

    const imagePath = getStoragePathFromPublicUrl(item.image_url)
    if (imagePath) {
      await supabase.storage.from(galleryBucket).remove([imagePath])
    }

    if (editingId === item.id) {
      resetForm()
    }

    invalidateGalleryItemsCache()
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    setSuccessMessage(t('admin.gallery.deleteSuccess'))
    setDeletingId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = formState.title.trim()
    const description = formState.description.trim()
    const story = formState.story.trim()
    const location = formState.location.trim()
    const year = formState.year.trim()

    if (!title || !description || !story || !location || !year) {
      setErrorMessage(t('admin.gallery.validationError'))
      return
    }

    if (!editingId && !imageFile) {
      setErrorMessage(t('admin.gallery.imageRequired'))
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    let imageUrl = editingItem?.image_url ?? null
    let previousImagePath: string | null = null

    if (imageFile) {
      const imagePath = buildImagePath(formState.filterId, title, imageFile.name)

      const { error: uploadError } = await supabase.storage
        .from(galleryBucket)
        .upload(imagePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        setErrorMessage(uploadError.message)
        setIsSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from(galleryBucket)
        .getPublicUrl(imagePath)

      imageUrl = publicUrlData.publicUrl
      previousImagePath = getStoragePathFromPublicUrl(editingItem?.image_url ?? null)
    }

    const payload = {
      filter_id: formState.filterId,
      title,
      description,
      story,
      location,
      year,
      image_url: imageUrl,
      span: formState.span,
      sort_order: Number(formState.sortOrder) || galleryCount + 1,
      is_active: true,
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('gallery_items')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single()

      if (error) {
        setErrorMessage(error.message)
        setIsSaving(false)
        return
      }

      if (previousImagePath) {
        await supabase.storage.from(galleryBucket).remove([previousImagePath])
      }

      invalidateGalleryItemsCache()
      setItems((current) =>
        current
          .map((item) => (item.id === editingId ? ((data as GalleryRecord) ?? item) : item))
          .sort((left, right) => left.sort_order - right.sort_order),
      )
      setSuccessMessage(t('admin.gallery.updateSuccess'))
    } else {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert(payload)
        .select()
        .single()

      if (error) {
        setErrorMessage(error.message)
        setIsSaving(false)
        return
      }

      invalidateGalleryItemsCache()
      setItems((current) =>
        [...current, data as GalleryRecord].sort(
          (left, right) => left.sort_order - right.sort_order,
        ),
      )
      setSuccessMessage(t('admin.gallery.createSuccess'))
    }

    resetForm()
    setIsSaving(false)
  }

  return (
    <AdminShellLayout
      description={t('admin.gallery.description')}
      eyebrow={t('admin.gallery.eyebrow')}
      headerActions={
        <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            {t('admin.gallery.headerCardLabel')}
          </p>
          <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {galleryCount}
          </p>
          <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#6a7c87]">
            {t('admin.gallery.headerCardContext')}
          </p>
        </div>
      }
      title={t('admin.gallery.title')}
    >
      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#edf3f7] pb-5">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {editingId ? t('admin.gallery.editTitle') : t('admin.gallery.createTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.gallery.formIntro')}
              </p>
            </div>
            {editingId ? (
              <button
                className="rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.gallery.cancelEdit')}
              </button>
            ) : null}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.gallery.fields.category')}
                </span>
                <select
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('filterId', event.target.value)}
                  value={formState.filterId}
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.gallery.fields.span')}
                </span>
                <select
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('span', event.target.value as GallerySpan)}
                  value={formState.span}
                >
                  <option value="large">{t('admin.gallery.spans.large')}</option>
                  <option value="medium">{t('admin.gallery.spans.medium')}</option>
                  <option value="small">{t('admin.gallery.spans.small')}</option>
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                {t('admin.gallery.fields.title')}
              </span>
              <input
                className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                onChange={(event) => handleFieldChange('title', event.target.value)}
                placeholder={t('admin.gallery.placeholders.title')}
                value={formState.title}
              />
            </label>

            <label className="space-y-2">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                {t('admin.gallery.fields.description')}
              </span>
              <textarea
                className="min-h-[100px] w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] leading-[1.7] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                onChange={(event) => handleFieldChange('description', event.target.value)}
                placeholder={t('admin.gallery.placeholders.description')}
                value={formState.description}
              />
            </label>

            <label className="space-y-2">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                {t('admin.gallery.fields.story')}
              </span>
              <textarea
                className="min-h-[130px] w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] leading-[1.7] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                onChange={(event) => handleFieldChange('story', event.target.value)}
                placeholder={t('admin.gallery.placeholders.story')}
                value={formState.story}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.gallery.fields.location')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('location', event.target.value)}
                  placeholder={t('admin.gallery.placeholders.location')}
                  value={formState.location}
                />
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.gallery.fields.year')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('year', event.target.value)}
                  placeholder={t('admin.gallery.placeholders.year')}
                  value={formState.year}
                />
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.gallery.fields.sortOrder')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('sortOrder', event.target.value)}
                  placeholder={t('admin.gallery.placeholders.sortOrder')}
                  value={formState.sortOrder}
                />
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                {t('admin.gallery.fields.image')}
              </span>
              <input
                accept="image/*"
                className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[0.95rem] text-[#14324d] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef6fb] file:px-3 file:py-2 file:text-[0.8rem] file:font-semibold file:text-[#115b82]"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                ref={imageInputRef}
                type="file"
              />
              <p className="text-[0.84rem] leading-[1.6] text-[#7a8b95]">
                {t('admin.gallery.imageHelp')}
              </p>
              {editingItem?.image_url && !imageFile ? (
                <p className="text-[0.84rem] leading-[1.6] text-[#627581]">
                  {t('admin.gallery.currentImage')}
                </p>
              ) : null}
              {imageFile ? (
                <p className="text-[0.84rem] leading-[1.6] text-[#627581]">
                  {t('admin.gallery.newImageSelected', { fileName: imageFile.name })}
                </p>
              ) : null}
            </label>

            {errorMessage ? (
              <p className="rounded-[1rem] border border-[#f3d1d4] bg-[#fff6f7] px-4 py-3 text-sm leading-[1.7] text-[#9e3342]">
                {errorMessage}
              </p>
            ) : null}

            {successMessage ? (
              <p className="rounded-[1rem] border border-[#cde7d8] bg-[#f5fbf7] px-4 py-3 text-sm leading-[1.7] text-[#13703e]">
                {successMessage}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-full bg-[#13703e] px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#74a889]"
                disabled={isSaving}
                type="submit"
              >
                {isSaving
                  ? t('admin.gallery.saving')
                  : editingId
                    ? t('admin.gallery.saveChanges')
                    : t('admin.gallery.createButton')}
              </button>
              <button
                className="rounded-full border border-[#dbe7ee] bg-white px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#14324d] transition hover:border-[#c2d7e6] hover:bg-[#f9fcfe]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.gallery.resetForm')}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#edf3f7] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('admin.gallery.libraryTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.gallery.libraryIntro')}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
              onClick={() => void loadItems()}
              type="button"
            >
              <span className="material-symbols-outlined text-[1rem]">refresh</span>
              {t('admin.gallery.refresh')}
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
              {t('admin.gallery.loading')}
            </div>
          ) : null}

          {!isLoading && !items.length ? (
            <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
              {t('admin.gallery.emptyState')}
            </div>
          ) : null}

          {!isLoading && items.length ? (
            <div className="mt-6 grid gap-4">
              {items.map((item) => (
                <article
                  className="rounded-[1.15rem] border border-[#edf3f7] bg-[#fbfdff] p-4"
                  key={item.id}
                >
                  <div className="flex items-start gap-4">
                    <img
                      alt={item.title}
                      className="h-24 w-28 rounded-[0.85rem] bg-[#eef6fb] object-cover"
                      src={item.image_url}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                            {getGalleryCategoryLabel(t, item.filter_id)}
                          </p>
                          <h3 className="mt-1 font-serif text-[1.22rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
                            {item.title}
                          </h3>
                        </div>
                        <span className="rounded-full border border-[#dbe7ee] bg-white px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                          {item.span}
                        </span>
                      </div>

                      <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#6a7c87]">
                        {item.description}
                      </p>
                      <p className="mt-3 text-[0.82rem] text-[#8a9ba7]">
                        {item.location} • {item.year} • #{item.sort_order}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          className="rounded-full border border-[#dbe7ee] bg-white px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                          onClick={() => handleEdit(item)}
                          type="button"
                        >
                          {t('admin.gallery.editButton')}
                        </button>
                        <button
                          className="rounded-full border border-[#f2d6d9] bg-white px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#a33b49] transition hover:bg-[#fff7f8] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deletingId === item.id}
                          onClick={() => void handleDelete(item)}
                          type="button"
                        >
                          {deletingId === item.id
                            ? t('admin.gallery.deleting')
                            : t('admin.gallery.deleteButton')}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </AdminShellLayout>
  )
}

export default AdminGallery
