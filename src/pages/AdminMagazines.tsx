import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import { supabase } from '../utils/supabase'

type Magazine = {
  id: string
  title: string
  year: number
  description: string | null
  pdf_url: string
  cover_image_url: string | null
  created_at: string | null
}

type MagazineForm = {
  title: string
  year: string
  description: string
}

const initialFormState: MagazineForm = {
  title: '',
  year: '',
  description: '',
}

const magazineBucket = import.meta.env.VITE_SUPABASE_MAGAZINE_BUCKET || 'magazines'

const getFileExtension = (fileName: string) => {
  const segments = fileName.split('.')
  return segments.length > 1 ? segments.pop()?.toLowerCase() ?? '' : ''
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const buildStoragePath = (
  folder: 'pdfs' | 'covers',
  year: string,
  title: string,
  fileName: string,
) => {
  const extension = getFileExtension(fileName)
  const safeTitle = slugify(title) || 'magazine'
  const timestamp = Date.now()
  const safeYear = year || 'undated'

  return `${folder}/${safeYear}/${timestamp}-${safeTitle}${extension ? `.${extension}` : ''}`
}

const getStoragePathFromPublicUrl = (publicUrl: string | null) => {
  if (!publicUrl) {
    return null
  }

  const marker = `/storage/v1/object/public/${magazineBucket}/`
  const markerIndex = publicUrl.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  return publicUrl.slice(markerIndex + marker.length)
}

function AdminMagazines() {
  const { t } = useTranslation()
  const [magazines, setMagazines] = useState<Magazine[]>([])
  const [formState, setFormState] = useState<MagazineForm>(initialFormState)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  const magazineCount = useMemo(() => magazines.length, [magazines.length])
  const editingMagazine = useMemo(
    () => magazines.find((magazine) => magazine.id === editingId) ?? null,
    [editingId, magazines],
  )

  const loadMagazines = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('magazines')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMagazines((data ?? []) as Magazine[])
    setIsLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialMagazines = async () => {
      const { data, error } = await supabase
        .from('magazines')
        .select('*')
        .order('year', { ascending: false })
        .order('created_at', { ascending: false })

      if (!isMounted) {
        return
      }

      if (error) {
        setErrorMessage(error.message)
        setIsLoading(false)
        return
      }

      setMagazines((data ?? []) as Magazine[])
      setIsLoading(false)
    }

    loadInitialMagazines()

    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setFormState(initialFormState)
    setPdfFile(null)
    setCoverFile(null)
    setEditingId(null)
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }

  const handleFieldChange = (
    field: keyof MagazineForm,
    value: string,
  ) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleEdit = (magazine: Magazine) => {
    setEditingId(magazine.id)
    setSuccessMessage('')
    setErrorMessage('')
    setFormState({
      title: magazine.title,
      year: String(magazine.year),
      description: magazine.description ?? '',
    })
    setPdfFile(null)
    setCoverFile(null)
    if (pdfInputRef.current) {
      pdfInputRef.current.value = ''
    }
    if (coverInputRef.current) {
      coverInputRef.current.value = ''
    }
  }

  const handleDelete = async (magazine: Magazine) => {
    const shouldDelete = window.confirm(
      t('admin.magazines.deleteConfirmation', { title: magazine.title }),
    )

    if (!shouldDelete) {
      return
    }

    setDeletingId(magazine.id)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await supabase.from('magazines').delete().eq('id', magazine.id)

    if (error) {
      setErrorMessage(error.message)
      setDeletingId(null)
      return
    }

    const filesToDelete = [
      getStoragePathFromPublicUrl(magazine.pdf_url),
      getStoragePathFromPublicUrl(magazine.cover_image_url),
    ].filter(Boolean) as string[]

    if (filesToDelete.length > 0) {
      await supabase.storage.from(magazineBucket).remove(filesToDelete)
    }

    if (editingId === magazine.id) {
      resetForm()
    }

    setSuccessMessage(t('admin.magazines.deleteSuccess'))
    setDeletingId(null)
    await loadMagazines()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    const currentMagazine = editingMagazine

    const title = formState.title.trim()
    const year = Number(formState.year)
    const description = formState.description.trim() || null

    if (!title || !year) {
      setErrorMessage(t('admin.magazines.validationError'))
      setIsSaving(false)
      return
    }

    if (!pdfFile && !currentMagazine) {
      setErrorMessage(t('admin.magazines.pdfRequired'))
      setIsSaving(false)
      return
    }

    let pdfUrl = currentMagazine?.pdf_url ?? ''
    let coverImageUrl = currentMagazine?.cover_image_url ?? null

    if (pdfFile) {
      const pdfPath = buildStoragePath('pdfs', formState.year, title, pdfFile.name)
      const { error: pdfUploadError } = await supabase.storage
        .from(magazineBucket)
        .upload(pdfPath, pdfFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
        })

      if (pdfUploadError) {
        setErrorMessage(pdfUploadError.message)
        setIsSaving(false)
        return
      }

      const { data } = supabase.storage.from(magazineBucket).getPublicUrl(pdfPath)
      pdfUrl = data.publicUrl

      const oldPdfPath = getStoragePathFromPublicUrl(currentMagazine?.pdf_url ?? null)
      if (oldPdfPath) {
        await supabase.storage.from(magazineBucket).remove([oldPdfPath])
      }
    }

    if (coverFile) {
      const coverPath = buildStoragePath(
        'covers',
        formState.year,
        title,
        coverFile.name,
      )
      const { error: coverUploadError } = await supabase.storage
        .from(magazineBucket)
        .upload(coverPath, coverFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: coverFile.type || undefined,
        })

      if (coverUploadError) {
        setErrorMessage(coverUploadError.message)
        setIsSaving(false)
        return
      }

      const { data } = supabase.storage.from(magazineBucket).getPublicUrl(coverPath)
      coverImageUrl = data.publicUrl

      const oldCoverPath = getStoragePathFromPublicUrl(
        currentMagazine?.cover_image_url ?? null,
      )
      if (oldCoverPath) {
        await supabase.storage.from(magazineBucket).remove([oldCoverPath])
      }
    }

    const payload = {
      title,
      year,
      description,
      pdf_url: pdfUrl,
      cover_image_url: coverImageUrl,
    }

    const query = editingId
      ? supabase.from('magazines').update(payload).eq('id', editingId)
      : supabase.from('magazines').insert(payload)

    const { error } = await query

    if (error) {
      setErrorMessage(error.message)
      setIsSaving(false)
      return
    }

    setSuccessMessage(
      editingId
        ? t('admin.magazines.updateSuccess')
        : t('admin.magazines.createSuccess'),
    )
    resetForm()
    setIsSaving(false)
    await loadMagazines()
  }

  return (
    <AdminShellLayout
      description={t('admin.magazines.description')}
      eyebrow={t('admin.magazines.eyebrow')}
      headerActions={
        <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            {t('admin.magazines.headerCardLabel')}
          </p>
          <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {magazineCount}
          </p>
          <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#6a7c87]">
            {t('admin.magazines.headerCardContext')}
          </p>
        </div>
      }
      title={t('admin.magazines.title')}
    >
      <div className="mt-8 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {editingId
                  ? t('admin.magazines.editTitle')
                  : t('admin.magazines.createTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.magazines.formIntro')}
              </p>
            </div>
            {editingId ? (
              <button
                className="rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.magazines.cancelEdit')}
              </button>
            ) : null}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.magazines.fields.title')}
              </label>
              <input
                className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                onChange={(event) => handleFieldChange('title', event.target.value)}
                placeholder={t('admin.magazines.placeholders.title')}
                type="text"
                value={formState.title}
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.magazines.fields.year')}
              </label>
              <input
                className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                onChange={(event) => handleFieldChange('year', event.target.value)}
                placeholder={t('admin.magazines.placeholders.year')}
                type="number"
                value={formState.year}
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.magazines.fields.description')}
              </label>
              <textarea
                className="min-h-[132px] w-full rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3 text-[0.98rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82] focus:bg-white"
                onChange={(event) =>
                  handleFieldChange('description', event.target.value)
                }
                placeholder={t('admin.magazines.placeholders.description')}
                value={formState.description}
              />
            </div>

            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.magazines.fields.pdfFile')}
              </label>
              <div className="rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3">
                <input
                  accept="application/pdf"
                  className="block w-full text-[0.95rem] text-[#14324d] file:mr-4 file:rounded-full file:border-0 file:bg-[#edf7fc] file:px-4 file:py-2 file:text-[0.82rem] file:font-bold file:uppercase file:tracking-[0.14em] file:text-[#115b82]"
                  onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                  ref={pdfInputRef}
                  type="file"
                />
              </div>
              <p className="mt-2 text-[0.82rem] leading-[1.65] text-[#6a7c87]">
                {editingId
                  ? pdfFile
                    ? t('admin.magazines.newPdfSelected', { fileName: pdfFile.name })
                    : t('admin.magazines.currentPdf', {
                        fileName:
                          editingMagazine?.pdf_url.split('/').pop() ??
                          t('admin.magazines.fileOnRecord'),
                      })
                  : t('admin.magazines.pdfHelp')}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[0.88rem] font-semibold text-[#14324d]">
                {t('admin.magazines.fields.coverImageFile')}
              </label>
              <div className="rounded-[0.95rem] border border-[#d8e5ec] bg-[#fbfdff] px-4 py-3">
                <input
                  accept="image/*"
                  className="block w-full text-[0.95rem] text-[#14324d] file:mr-4 file:rounded-full file:border-0 file:bg-[#edf7fc] file:px-4 file:py-2 file:text-[0.82rem] file:font-bold file:uppercase file:tracking-[0.14em] file:text-[#115b82]"
                  onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  ref={coverInputRef}
                  type="file"
                />
              </div>
              <p className="mt-2 text-[0.82rem] leading-[1.65] text-[#6a7c87]">
                {coverFile
                  ? t('admin.magazines.newCoverSelected', { fileName: coverFile.name })
                  : editingId && editingMagazine?.cover_image_url
                    ? t('admin.magazines.currentCover')
                    : t('admin.magazines.coverHelp')}
              </p>
              {editingId && editingMagazine?.cover_image_url && !coverFile ? (
                <img
                  alt={editingMagazine.title}
                  className="mt-3 h-24 w-24 rounded-[0.9rem] border border-[#dbe7ee] object-cover"
                  src={editingMagazine.cover_image_url}
                />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="rounded-full bg-[#13703e] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_32px_rgba(19,112,62,0.18)] transition hover:bg-[#105f35] disabled:cursor-not-allowed disabled:bg-[#74a889]"
                disabled={isSaving}
                type="submit"
              >
                {isSaving
                  ? t('admin.magazines.saving')
                  : editingId
                    ? t('admin.magazines.saveChanges')
                    : t('admin.magazines.createButton')}
              </button>
              <button
                className="rounded-full border border-[#dbe7ee] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#14324d] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.magazines.resetForm')}
              </button>
            </div>
          </form>

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
        </section>

        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#edf3f7] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('admin.magazines.libraryTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.magazines.libraryIntro')}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
              onClick={loadMagazines}
              type="button"
            >
              <span className="material-symbols-outlined text-[1rem]">refresh</span>
              {t('admin.magazines.refresh')}
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              <div className="rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
                {t('admin.magazines.loading')}
              </div>
            ) : null}

            {!isLoading && magazines.length === 0 ? (
              <div className="rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
                {t('admin.magazines.emptyState')}
              </div>
            ) : null}

            {!isLoading
              ? magazines.map((magazine) => (
                  <article
                    className="rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-4"
                    key={magazine.id}
                  >
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="h-28 w-full overflow-hidden rounded-[1rem] bg-[#e8f0f5] md:w-28 md:min-w-28">
                        {magazine.cover_image_url ? (
                          <img
                            alt={magazine.title}
                            className="h-full w-full object-cover"
                            src={magazine.cover_image_url}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#7e93a0]">
                            <span className="material-symbols-outlined text-[2rem]">
                              menu_book
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[0.76rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
                              {magazine.year}
                            </p>
                            <h3 className="mt-2 text-[1.15rem] font-semibold text-[#14324d]">
                              {magazine.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:border-[#bfd5e4] hover:bg-white"
                              onClick={() => handleEdit(magazine)}
                              type="button"
                            >
                              {t('admin.magazines.editButton')}
                            </button>
                            <button
                              className="rounded-full border border-[#f3d1d4] px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={deletingId === magazine.id}
                              onClick={() => handleDelete(magazine)}
                              type="button"
                            >
                              {deletingId === magazine.id
                                ? t('admin.magazines.deleting')
                                : t('admin.magazines.deleteButton')}
                            </button>
                          </div>
                        </div>

                        {magazine.description ? (
                          <p className="mt-3 text-[0.95rem] leading-[1.75] text-[#627581]">
                            {magazine.description}
                          </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-3 text-[0.82rem] text-[#6a7c87]">
                          <a
                            className="inline-flex items-center gap-1 font-semibold text-[#115b82] hover:text-[#0c4867]"
                            href={magazine.pdf_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            <span className="material-symbols-outlined text-[1rem]">
                              picture_as_pdf
                            </span>
                            {t('admin.magazines.openPdf')}
                          </a>

                          {magazine.created_at ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[1rem]">
                                schedule
                              </span>
                              {new Date(magazine.created_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              : null}
          </div>
        </section>
      </div>
    </AdminShellLayout>
  )
}

export default AdminMagazines
