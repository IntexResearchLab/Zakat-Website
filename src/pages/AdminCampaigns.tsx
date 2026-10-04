import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import AdminImageInput from '../components/Admin/AdminImageInput'
import AdminItemControls from '../components/Admin/AdminItemControls'
import AdminShellLayout from '../components/Admin/AdminShellLayout'
import CampaignProgress from '../components/Campaigns/CampaignProgress'
import { getFriendlyErrorMessage, requireChangedRows } from '../lib/adminErrors'
import { donationCategories } from '../lib/adminDonations'
import { moveAndRenumber, persistSortOrder, setRowVisibility } from '../lib/adminOrdering'
import {
  getCampaignState,
  invalidateCampaignsCache,
  loadCampaigns,
  type Campaign,
} from '../lib/campaigns'
import { supabase } from '../utils/supabase'

const campaignBucket = 'campaigns'

type CampaignForm = {
  slug: string
  titleEn: string
  titleBn: string
  summaryEn: string
  summaryBn: string
  storyEn: string
  storyBn: string
  goal: string
  category: (typeof donationCategories)[number]
  startsOn: string
  endsOn: string
}

const emptyForm: CampaignForm = {
  slug: '',
  titleEn: '',
  titleBn: '',
  summaryEn: '',
  summaryBn: '',
  storyEn: '',
  storyBn: '',
  goal: '',
  category: 'default',
  startsOn: '',
  endsOn: '',
}

const fieldClass =
  'w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-2.5 text-[0.95rem] text-[#14324d] outline-none transition placeholder:text-[#627581] focus:border-[#115b82]'
const labelClass = 'grid gap-1.5 text-[0.86rem] font-semibold text-[#14324d]'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const getStoragePathFromPublicUrl = (publicUrl: string | null) => {
  const marker = `/storage/v1/object/public/${campaignBucket}/`
  const index = publicUrl?.indexOf(marker) ?? -1
  return publicUrl && index !== -1 ? publicUrl.slice(index + marker.length) : null
}

const toForm = (campaign: Campaign): CampaignForm => ({
  slug: campaign.slug,
  titleEn: campaign.title_en,
  titleBn: campaign.title_bn ?? '',
  summaryEn: campaign.summary_en,
  summaryBn: campaign.summary_bn ?? '',
  storyEn: campaign.story_en ?? '',
  storyBn: campaign.story_bn ?? '',
  goal: String(campaign.goal_amount),
  category: (donationCategories as readonly string[]).includes(campaign.category)
    ? (campaign.category as CampaignForm['category'])
    : 'default',
  startsOn: campaign.starts_on ?? '',
  endsOn: campaign.ends_on ?? '',
})

function AdminCampaigns() {
  const { t } = useTranslation()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [form, setForm] = useState<CampaignForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [slugTouched, setSlugTouched] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const editingCampaign = campaigns.find((campaign) => campaign.id === editingId) ?? null
  const hasUnsavedChanges =
    isFormOpen &&
    (Boolean(imageFile) ||
      JSON.stringify(form) !==
        JSON.stringify(editingCampaign ? toForm(editingCampaign) : emptyForm))

  const refresh = async () => {
    setIsLoading(true)
    try {
      setCampaigns(await loadCampaigns())
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

  const update = (field: keyof CampaignForm) => (value: string) =>
    setForm((current) => {
      const next = { ...current, [field]: value }
      // The web address follows the English title until it is edited by hand.
      if (field === 'titleEn' && !slugTouched && !editingId) {
        next.slug = slugify(value)
      }
      return next
    })

  const openNew = () => {
    setForm(emptyForm)
    setEditingId(null)
    setSlugTouched(false)
    setImageFile(null)
    setErrorMessage('')
    setSuccessMessage('')
    setIsFormOpen(true)
  }

  const openEdit = (campaign: Campaign) => {
    setForm(toForm(campaign))
    setEditingId(campaign.id)
    setSlugTouched(true)
    setImageFile(null)
    setErrorMessage('')
    setSuccessMessage('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    if (hasUnsavedChanges && !window.confirm(t('admin.unsaved.leaveConfirmation'))) {
      return
    }
    setIsFormOpen(false)
    setEditingId(null)
    setImageFile(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const goal = Number(form.goal.replace(/[^\d.]/g, ''))
    const slug = slugify(form.slug)

    if (!form.titleEn.trim() || !form.summaryEn.trim()) {
      setErrorMessage(t('admin.campaigns.errors.required'))
      return
    }
    if (!slug) {
      setErrorMessage(t('admin.campaigns.errors.slug'))
      return
    }
    if (!Number.isFinite(goal) || goal <= 0) {
      setErrorMessage(t('admin.campaigns.errors.goal'))
      return
    }
    if (form.startsOn && form.endsOn && form.endsOn < form.startsOn) {
      setErrorMessage(t('admin.campaigns.errors.dates'))
      return
    }

    setIsSaving(true)

    let imageUrl = editingCampaign?.image_url ?? null
    let uploadedPath: string | null = null

    if (imageFile) {
      const extension = imageFile.name.split('.').pop()?.toLowerCase() || 'jpg'
      uploadedPath = `${slug}/${Date.now()}.${extension}`
      const { error } = await supabase.storage
        .from(campaignBucket)
        .upload(uploadedPath, imageFile, { contentType: imageFile.type })

      if (error) {
        setErrorMessage(getFriendlyErrorMessage(t, error))
        setIsSaving(false)
        return
      }

      imageUrl = supabase.storage.from(campaignBucket).getPublicUrl(uploadedPath).data.publicUrl
    }

    const payload = {
      slug,
      title_en: form.titleEn.trim(),
      title_bn: form.titleBn.trim() || null,
      summary_en: form.summaryEn.trim(),
      summary_bn: form.summaryBn.trim() || null,
      story_en: form.storyEn.trim() || null,
      story_bn: form.storyBn.trim() || null,
      goal_amount: goal,
      category: form.category,
      starts_on: form.startsOn || null,
      ends_on: form.endsOn || null,
      image_url: imageUrl,
    }

    const error = requireChangedRows(
      editingId
        ? await supabase.from('campaigns').update(payload).eq('id', editingId).select('id')
        : await supabase
            .from('campaigns')
            .insert({ ...payload, sort_order: campaigns.length + 1 })
            .select('id'),
    )

    if (error) {
      // Don't leave an orphaned photo behind when the save itself failed.
      if (uploadedPath) {
        await supabase.storage.from(campaignBucket).remove([uploadedPath])
      }
      setErrorMessage(getFriendlyErrorMessage(t, error))
      setIsSaving(false)
      return
    }

    const previousPath = uploadedPath
      ? getStoragePathFromPublicUrl(editingCampaign?.image_url ?? null)
      : null
    if (previousPath) {
      await supabase.storage.from(campaignBucket).remove([previousPath])
    }

    invalidateCampaignsCache()
    await refresh()
    setIsFormOpen(false)
    setEditingId(null)
    setImageFile(null)
    setSuccessMessage(
      t(editingId ? 'admin.campaigns.updated' : 'admin.campaigns.created', {
        title: payload.title_en,
      }),
    )
    setIsSaving(false)
  }

  const handleMove = async (campaign: Campaign, direction: -1 | 1) => {
    const { nextItems, changedRows } = moveAndRenumber(campaigns, campaign.id, direction)
    if (!changedRows.length) {
      return
    }

    const previous = campaigns
    setBusyId(campaign.id)
    setCampaigns(nextItems)
    const error = await persistSortOrder('campaigns', changedRows)
    if (error) {
      setCampaigns(previous)
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateCampaignsCache()
    }
    setBusyId(null)
  }

  const handleToggleVisibility = async (campaign: Campaign) => {
    setBusyId(campaign.id)
    setErrorMessage('')
    const error = await setRowVisibility('campaigns', campaign.id, !campaign.is_active)
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      invalidateCampaignsCache()
      setCampaigns((current) =>
        current.map((item) =>
          item.id === campaign.id ? { ...item, is_active: !item.is_active } : item,
        ),
      )
      setSuccessMessage(
        t(campaign.is_active ? 'admin.list.hiddenSuccess' : 'admin.list.shownSuccess', {
          name: campaign.title_en,
        }),
      )
    }
    setBusyId(null)
  }

  const handleDelete = async (campaign: Campaign) => {
    if (!window.confirm(t('admin.campaigns.deleteConfirm', { title: campaign.title_en }))) {
      return
    }

    setBusyId(campaign.id)
    setErrorMessage('')
    const error = requireChangedRows(
      await supabase.from('campaigns').delete().eq('id', campaign.id).select('id'),
    )
    if (error) {
      setErrorMessage(getFriendlyErrorMessage(t, error))
    } else {
      const imagePath = getStoragePathFromPublicUrl(campaign.image_url)
      if (imagePath) {
        await supabase.storage.from(campaignBucket).remove([imagePath])
      }
      invalidateCampaignsCache()
      setCampaigns((current) => current.filter((item) => item.id !== campaign.id))
      setSuccessMessage(t('admin.campaigns.deleted', { title: campaign.title_en }))
    }
    setBusyId(null)
  }

  return (
    <AdminShellLayout
      description={t('admin.campaigns.description')}
      eyebrow={t('admin.campaigns.eyebrow')}
      hasUnsavedChanges={hasUnsavedChanges}
      title={t('admin.campaigns.title')}
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
          {t('admin.campaigns.new')}
        </button>
      ) : (
        <form
          className="mt-8 rounded-[1.35rem] border border-[#9fc7da] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]"
          noValidate
          onSubmit={(event) => void handleSubmit(event)}
        >
          <h2 className="font-serif text-[1.6rem] leading-none tracking-[-0.03em] text-[#14324d]">
            {editingId ? t('admin.campaigns.editTitle') : t('admin.campaigns.newTitle')}
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              {t('admin.campaigns.fields.titleEn')}
              <input
                className={fieldClass}
                id="campaign-title-en"
                onChange={(e) => update('titleEn')(e.target.value)}
                value={form.titleEn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.titleBn')}
              <input
                className={fieldClass}
                id="campaign-title-bn"
                lang="bn"
                onChange={(e) => update('titleBn')(e.target.value)}
                value={form.titleBn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.summaryEn')}
              <textarea
                className={`${fieldClass} min-h-[5rem]`}
                id="campaign-summary-en"
                onChange={(e) => update('summaryEn')(e.target.value)}
                value={form.summaryEn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.summaryBn')}
              <textarea
                className={`${fieldClass} min-h-[5rem]`}
                id="campaign-summary-bn"
                lang="bn"
                onChange={(e) => update('summaryBn')(e.target.value)}
                value={form.summaryBn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.storyEn')}
              <textarea
                className={`${fieldClass} min-h-[9rem]`}
                id="campaign-story-en"
                onChange={(e) => update('storyEn')(e.target.value)}
                value={form.storyEn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.storyBn')}
              <textarea
                className={`${fieldClass} min-h-[9rem]`}
                id="campaign-story-bn"
                lang="bn"
                onChange={(e) => update('storyBn')(e.target.value)}
                value={form.storyBn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.goal')}
              <input
                className={fieldClass}
                id="campaign-goal"
                inputMode="decimal"
                onChange={(e) => update('goal')(e.target.value)}
                placeholder="৳"
                value={form.goal}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.category')}
              <select
                className={fieldClass}
                id="campaign-category"
                onChange={(e) => update('category')(e.target.value)}
                value={form.category}
              >
                {donationCategories.map((category) => (
                  <option key={category} value={category}>
                    {t(`donate.main.categories.${category}`)}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.startsOn')}
              <input
                className={fieldClass}
                id="campaign-starts"
                onChange={(e) => update('startsOn')(e.target.value)}
                type="date"
                value={form.startsOn}
              />
            </label>
            <label className={labelClass}>
              {t('admin.campaigns.fields.endsOn')}
              <input
                className={fieldClass}
                id="campaign-ends"
                min={form.startsOn || undefined}
                onChange={(e) => update('endsOn')(e.target.value)}
                type="date"
                value={form.endsOn}
              />
            </label>
            <label className={`${labelClass} md:col-span-2`}>
              {t('admin.campaigns.fields.slug')}
              <span className="flex items-center gap-2">
                <span className="shrink-0 text-[0.9rem] font-normal text-[#5d6d78]">
                  /campaigns/
                </span>
                <input
                  className={fieldClass}
                  id="campaign-slug"
                  onChange={(e) => {
                    setSlugTouched(true)
                    update('slug')(e.target.value.toLowerCase())
                  }}
                  value={form.slug}
                />
              </span>
              <span className="text-[0.82rem] font-normal text-[#5d6d78]">
                {t('admin.campaigns.slugHelp')}
              </span>
            </label>
          </div>

          <div className="mt-5 grid gap-2">
            <span className="text-[0.86rem] font-semibold text-[#14324d]">
              {t('admin.campaigns.fields.image')}
            </span>
            <AdminImageInput
              alt={form.titleEn || t('admin.campaigns.fields.image')}
              currentImageUrl={editingCampaign?.image_url}
              file={imageFile}
              inputClassName="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[0.95rem] text-[#14324d] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef6fb] file:px-3 file:py-2 file:text-[0.8rem] file:font-semibold file:text-[#115b82]"
              maxDimension={1600}
              onChange={(file) => {
                setErrorMessage('')
                setImageFile(file)
              }}
              onError={setErrorMessage}
              previewClassName="h-36 w-full max-w-[16rem] object-cover"
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
              {isSaving ? t('admin.campaigns.saving') : t('admin.campaigns.save')}
            </button>
            <button
              className="rounded-full border border-[#dbe7ee] bg-white px-6 py-2.5 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-[#14324d] transition hover:bg-[#f7fbfd]"
              disabled={isSaving}
              onClick={closeForm}
              type="button"
            >
              {t('admin.campaigns.cancel')}
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 rounded-[1.35rem] border border-[#dbe7ee] bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
        <h2 className="font-serif text-[1.8rem] leading-none tracking-[-0.03em] text-[#14324d]">
          {t('admin.campaigns.listTitle')}
        </h2>
        <p className="mt-3 text-[0.96rem] leading-[1.75] text-[#5d6d78]">
          {t('admin.campaigns.listIntro')}
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
            {t('admin.campaigns.loading')}
          </p>
        ) : !campaigns.length ? (
          <p className="mt-6 rounded-[1rem] border border-dashed border-[#dbe7ee] px-4 py-10 text-center text-[#5d6d78]">
            {t('admin.campaigns.empty')}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {campaigns.map((campaign, index) => {
              const state = getCampaignState(campaign)
              return (
                <li
                  className="grid gap-5 rounded-[1.1rem] border border-[#edf3f7] bg-[#fbfdff] p-5 md:grid-cols-[9rem_1fr]"
                  key={campaign.id}
                >
                  {campaign.image_url ? (
                    <img
                      alt=""
                      className="aspect-[4/3] w-full rounded-[0.8rem] object-cover"
                      decoding="async"
                      loading="lazy"
                      src={campaign.image_url}
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-[4/3] w-full rounded-[0.8rem] bg-[linear-gradient(135deg,#115b82,#13703e)]"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-[1.3rem] leading-tight tracking-[-0.02em] text-[#14324d]">
                        {campaign.title_en}
                      </p>
                      <span className="rounded-full border border-[#dbe7ee] bg-[#f6f9fb] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#4f6473]">
                        {campaign.is_active
                          ? t(`admin.campaigns.state.${state}`)
                          : t('admin.campaigns.state.hidden')}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[0.8rem] text-[#5d6d78]">
                      /campaigns/{campaign.slug}
                    </p>
                    <div className="mt-3 max-w-xl">
                      <CampaignProgress campaign={campaign} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <AdminItemControls
                        canMoveDown={index < campaigns.length - 1}
                        canMoveUp={index > 0}
                        isActive={campaign.is_active}
                        isBusy={busyId === campaign.id}
                        onMove={(direction) => void handleMove(campaign, direction)}
                        onToggleVisibility={() => void handleToggleVisibility(campaign)}
                        viewHref={state === 'upcoming' ? undefined : `/campaigns/${campaign.slug}`}
                      />
                      <button
                        className="inline-flex h-9 items-center rounded-full border border-[#dbe7ee] bg-white px-4 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#115b82] transition hover:bg-[#f7fbfd]"
                        onClick={() => openEdit(campaign)}
                        type="button"
                      >
                        {t('admin.campaigns.edit')}
                      </button>
                      <button
                        className="inline-flex h-9 items-center rounded-full px-3 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[#9e3342] transition hover:bg-[#fff6f7] disabled:opacity-60"
                        disabled={busyId === campaign.id}
                        onClick={() => void handleDelete(campaign)}
                        type="button"
                      >
                        {t('admin.campaigns.delete')}
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

export default AdminCampaigns
