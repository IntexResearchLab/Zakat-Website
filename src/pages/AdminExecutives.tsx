import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import {
  invalidateExecutiveRowsCache,
  type ExecutiveMember,
} from '../lib/executives'
import { supabase } from '../utils/supabase'

type ExecutiveForm = {
  name: string
  role: string
  email: string
  phone: string
  sortOrder: string
}

const initialFormState: ExecutiveForm = {
  name: '',
  role: '',
  email: '',
  phone: '',
  sortOrder: '',
}

const executiveBucket = import.meta.env.VITE_SUPABASE_EXECUTIVE_BUCKET || 'executives'

const getFileExtension = (fileName: string) => {
  const segments = fileName.split('.')
  return segments.length > 1 ? segments.pop()?.toLowerCase() ?? '' : ''
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const buildImagePath = (name: string, fileName: string) => {
  const extension = getFileExtension(fileName)
  const safeName = slugify(name) || 'executive'
  return `members/${Date.now()}-${safeName}${extension ? `.${extension}` : ''}`
}

const getStoragePathFromPublicUrl = (publicUrl: string | null) => {
  if (!publicUrl) {
    return null
  }

  const marker = `/storage/v1/object/public/${executiveBucket}/`
  const markerIndex = publicUrl.indexOf(marker)

  if (markerIndex === -1) {
    return null
  }

  return publicUrl.slice(markerIndex + marker.length)
}

function AdminExecutives() {
  const { t } = useTranslation()
  const [members, setMembers] = useState<ExecutiveMember[]>([])
  const [formState, setFormState] = useState<ExecutiveForm>(initialFormState)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const memberCount = members.length
  const editingMember = useMemo(
    () => members.find((member) => member.id === editingId) ?? null,
    [editingId, members],
  )

  const loadMembers = async () => {
    setIsLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('executive_members')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    setMembers((data ?? []) as ExecutiveMember[])
    setIsLoading(false)
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialMembers = async () => {
      const { data, error } = await supabase
        .from('executive_members')
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

      setMembers((data ?? []) as ExecutiveMember[])
      setIsLoading(false)
    }

    void loadInitialMembers()

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

  const handleFieldChange = (field: keyof ExecutiveForm, value: string) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleEdit = (member: ExecutiveMember) => {
    setEditingId(member.id)
    setErrorMessage('')
    setSuccessMessage('')
    setImageFile(null)
    setFormState({
      name: member.name,
      role: member.role,
      email: member.email ?? '',
      phone: member.phone ?? '',
      sortOrder: String(member.sort_order),
    })
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const handleDelete = async (member: ExecutiveMember) => {
    const shouldDelete = window.confirm(
      t('admin.executives.deleteConfirmation', { name: member.name }),
    )

    if (!shouldDelete) {
      return
    }

    setDeletingId(member.id)
    setErrorMessage('')
    setSuccessMessage('')

    const { error } = await supabase.from('executive_members').delete().eq('id', member.id)

    if (error) {
      setErrorMessage(error.message)
      setDeletingId(null)
      return
    }

    const imagePath = getStoragePathFromPublicUrl(member.image_url)
    if (imagePath) {
      await supabase.storage.from(executiveBucket).remove([imagePath])
    }

    if (editingId === member.id) {
      resetForm()
    }

    invalidateExecutiveRowsCache()
    setMembers((current) => current.filter((item) => item.id !== member.id))
    setSuccessMessage(t('admin.executives.deleteSuccess'))
    setDeletingId(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const name = formState.name.trim()
    const role = formState.role.trim()

    if (!name || !role) {
      setErrorMessage(t('admin.executives.validationError'))
      return
    }

    if (!editingId && !imageFile) {
      setErrorMessage(t('admin.executives.imageRequired'))
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    let imageUrl = editingMember?.image_url ?? null
    let previousImagePath: string | null = null

    if (imageFile) {
      const imagePath = buildImagePath(name, imageFile.name)

      const { error: uploadError } = await supabase.storage
        .from(executiveBucket)
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
        .from(executiveBucket)
        .getPublicUrl(imagePath)

      imageUrl = publicUrlData.publicUrl
      previousImagePath = getStoragePathFromPublicUrl(editingMember?.image_url ?? null)
    }

    const payload = {
      name,
      role,
      email: formState.email.trim() || null,
      phone: formState.phone.trim() || null,
      image_url: imageUrl,
      sort_order: Number(formState.sortOrder) || memberCount + 1,
      is_active: true,
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('executive_members')
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
        await supabase.storage.from(executiveBucket).remove([previousImagePath])
      }

      invalidateExecutiveRowsCache()
      setMembers((current) =>
        current
          .map((item) => (item.id === editingId ? ((data as ExecutiveMember) ?? item) : item))
          .sort((left, right) => left.sort_order - right.sort_order),
      )
      setSuccessMessage(t('admin.executives.updateSuccess'))
    } else {
      const { data, error } = await supabase
        .from('executive_members')
        .insert(payload)
        .select()
        .single()

      if (error) {
        setErrorMessage(error.message)
        setIsSaving(false)
        return
      }

      invalidateExecutiveRowsCache()
      setMembers((current) =>
        [...current, data as ExecutiveMember].sort(
          (left, right) => left.sort_order - right.sort_order,
        ),
      )
      setSuccessMessage(t('admin.executives.createSuccess'))
    }

    resetForm()
    setIsSaving(false)
  }

  return (
    <AdminShellLayout
      description={t('admin.executives.description')}
      eyebrow={t('admin.executives.eyebrow')}
      headerActions={
        <div className="rounded-[1rem] border border-[#dbe7ee] bg-white px-4 py-3 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[#115b82]">
            {t('admin.executives.headerCardLabel')}
          </p>
          <p className="mt-2 font-serif text-[2rem] leading-none tracking-[-0.05em] text-[#14324d]">
            {memberCount}
          </p>
          <p className="mt-2 text-[0.9rem] leading-[1.6] text-[#6a7c87]">
            {t('admin.executives.headerCardContext')}
          </p>
        </div>
      }
      title={t('admin.executives.title')}
    >
      <div className="mt-8 grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex items-start justify-between gap-4 border-b border-[#edf3f7] pb-5">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {editingId
                  ? t('admin.executives.editTitle')
                  : t('admin.executives.createTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.executives.formIntro')}
              </p>
            </div>
            {editingId ? (
              <button
                className="rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.executives.cancelEdit')}
              </button>
            ) : null}
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.name')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  placeholder={t('admin.executives.placeholders.name')}
                  value={formState.name}
                />
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.role')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('role', event.target.value)}
                  placeholder={t('admin.executives.placeholders.role')}
                  value={formState.role}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.email')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('email', event.target.value)}
                  placeholder={t('admin.executives.placeholders.email')}
                  type="email"
                  value={formState.email}
                />
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.phone')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('phone', event.target.value)}
                  placeholder={t('admin.executives.placeholders.phone')}
                  value={formState.phone}
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.image')}
                </span>
                <input
                  accept="image/*"
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[0.95rem] text-[#14324d] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef6fb] file:px-3 file:py-2 file:text-[0.8rem] file:font-semibold file:text-[#115b82]"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                  ref={imageInputRef}
                  type="file"
                />
                <p className="text-[0.84rem] leading-[1.6] text-[#7a8b95]">
                  {t('admin.executives.imageHelp')}
                </p>
                {editingMember?.image_url && !imageFile ? (
                  <p className="text-[0.84rem] leading-[1.6] text-[#627581]">
                    {t('admin.executives.currentImage')}
                  </p>
                ) : null}
                {imageFile ? (
                  <p className="text-[0.84rem] leading-[1.6] text-[#627581]">
                    {t('admin.executives.newImageSelected', { fileName: imageFile.name })}
                  </p>
                ) : null}
              </label>

              <label className="space-y-2">
                <span className="text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[#6a7c87]">
                  {t('admin.executives.fields.sortOrder')}
                </span>
                <input
                  className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[1rem] text-[#14324d] outline-none transition placeholder:text-[#90a3af] focus:border-[#115b82]"
                  onChange={(event) => handleFieldChange('sortOrder', event.target.value)}
                  placeholder={t('admin.executives.placeholders.sortOrder')}
                  value={formState.sortOrder}
                />
              </label>
            </div>

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
                  ? t('admin.executives.saving')
                  : editingId
                    ? t('admin.executives.saveChanges')
                    : t('admin.executives.createButton')}
              </button>
              <button
                className="rounded-full border border-[#dbe7ee] bg-white px-5 py-3 text-[0.8rem] font-bold uppercase tracking-[0.16em] text-[#14324d] transition hover:border-[#c2d7e6] hover:bg-[#f9fcfe]"
                onClick={resetForm}
                type="button"
              >
                {t('admin.executives.resetForm')}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 border-b border-[#edf3f7] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
                {t('admin.executives.libraryTitle')}
              </h2>
              <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#627581]">
                {t('admin.executives.libraryIntro')}
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-[#dbe7ee] px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
              onClick={() => void loadMembers()}
              type="button"
            >
              <span className="material-symbols-outlined text-[1rem]">refresh</span>
              {t('admin.executives.refresh')}
            </button>
          </div>

          {isLoading ? (
            <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
              {t('admin.executives.loading')}
            </div>
          ) : null}

          {!isLoading && !members.length ? (
            <div className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] bg-[#fbfdff] px-4 py-10 text-center text-[#6a7c87]">
              {t('admin.executives.emptyState')}
            </div>
          ) : null}

          {!isLoading && members.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {members.map((member) => (
                <article
                  className="rounded-[1.15rem] border border-[#edf3f7] bg-[#fbfdff] p-4"
                  key={member.id}
                >
                  <div className="flex items-start gap-4">
                    <img
                      alt={member.name}
                      className="h-24 w-20 rounded-[0.85rem] bg-[#eef6fb] object-cover"
                      src={member.image_url || '/assets/about/person-1.jpg'}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-[1.22rem] leading-[1.1] tracking-[-0.03em] text-[#14324d]">
                            {member.name}
                          </h3>
                          <p className="mt-1 text-[0.9rem] leading-[1.5] text-[#6a7c87]">
                            {member.role}
                          </p>
                        </div>
                        <span className="rounded-full border border-[#dbe7ee] bg-white px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#115b82]">
                          #{member.sort_order}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-[0.86rem] text-[#5d6f7b]">
                        {member.email ? <p>{member.email}</p> : null}
                        {member.phone ? <p>{member.phone}</p> : null}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          className="rounded-full border border-[#dbe7ee] bg-white px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#115b82] transition hover:border-[#bfd5e4] hover:bg-[#f7fbfd]"
                          onClick={() => handleEdit(member)}
                          type="button"
                        >
                          {t('admin.executives.editButton')}
                        </button>
                        <button
                          className="rounded-full border border-[#f2d6d9] bg-white px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#a33b49] transition hover:bg-[#fff7f8] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={deletingId === member.id}
                          onClick={() => void handleDelete(member)}
                          type="button"
                        >
                          {deletingId === member.id
                            ? t('admin.executives.deleting')
                            : t('admin.executives.deleteButton')}
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

export default AdminExecutives
