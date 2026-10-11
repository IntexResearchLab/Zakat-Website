import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { newPhoto, releasePhotoPreviews, type AdminPhoto } from '../../lib/adminPhotos'
import {
  compressImage,
  isSupportedImage,
  maxImageUploadBytes,
} from '../../lib/imageCompression'

type AdminPhotoListInputProps = {
  photos: AdminPhoto[]
  maxPhotos: number
  maxDimension: number
  alt: string
  onChange: (photos: AdminPhoto[]) => void
  onError: (message: string) => void
}

const iconButtonBase =
  'inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe7ee] bg-white/95 shadow-sm transition hover:bg-[#f7fbfd] disabled:cursor-not-allowed disabled:opacity-40'
const iconButtonClass = `${iconButtonBase} text-[#115b82]`

// Several photos in display order. Each picked photo is shrunk in the browser right away, like
// AdminImageInput, and nothing is uploaded until the form is saved.
function AdminPhotoListInput({
  photos,
  maxPhotos,
  maxDimension,
  alt,
  onChange,
  onError,
}: AdminPhotoListInputProps) {
  const { t } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const remaining = maxPhotos - photos.length

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    event.target.value = ''

    if (!selected.length) {
      return
    }

    const supported = selected.filter(isSupportedImage)
    const accepted = supported.slice(0, Math.max(0, remaining))
    const problems: string[] = []

    if (supported.length < selected.length) {
      problems.push(t('admin.images.unsupportedType'))
    }
    if (accepted.length < supported.length) {
      problems.push(t('admin.updates.photos.tooMany', { max: maxPhotos }))
    }

    setIsProcessing(true)
    const added: AdminPhoto[] = []

    for (const file of accepted) {
      const optimized = await compressImage(file, { maxDimension })

      if (optimized.size > maxImageUploadBytes) {
        problems.push(t('admin.errors.fileTooLarge'))
        continue
      }

      added.push(newPhoto(optimized))
    }

    setIsProcessing(false)
    onError([...new Set(problems)].join(' '))

    if (added.length) {
      onChange([...photos, ...added])
    }
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= photos.length) {
      return
    }
    const next = [...photos]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const remove = (index: number) => {
    releasePhotoPreviews([photos[index]])
    onChange(photos.filter((_, position) => position !== index))
  }

  return (
    <div className="space-y-3">
      {photos.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <li
              className="relative overflow-hidden rounded-[0.9rem] border border-[#dbe7ee] bg-[#eef6fb]"
              key={photo.key}
            >
              <img
                alt={t('admin.updates.photos.alt', { title: alt, number: index + 1 })}
                className="aspect-[4/3] w-full object-cover"
                decoding="async"
                loading="lazy"
                src={photo.kind === 'new' ? photo.previewUrl : photo.url}
              />
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {index === 0 ? (
                  <span className="rounded-full bg-[#13703e] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">
                    {t('admin.updates.photos.cover')}
                  </span>
                ) : null}
                {photo.kind === 'new' ? (
                  <span className="rounded-full bg-[#115b82] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white">
                    {t('admin.updates.photos.new')}
                  </span>
                ) : null}
              </div>
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  aria-label={t('admin.updates.photos.moveEarlier', { number: index + 1 })}
                  className={iconButtonClass}
                  disabled={isProcessing || index === 0}
                  onClick={() => move(index, -1)}
                  title={t('admin.updates.photos.moveEarlier', { number: index + 1 })}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                    west
                  </span>
                </button>
                <button
                  aria-label={t('admin.updates.photos.moveLater', { number: index + 1 })}
                  className={iconButtonClass}
                  disabled={isProcessing || index === photos.length - 1}
                  onClick={() => move(index, 1)}
                  title={t('admin.updates.photos.moveLater', { number: index + 1 })}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                    east
                  </span>
                </button>
                <button
                  aria-label={t('admin.updates.photos.remove', { number: index + 1 })}
                  className={`${iconButtonBase} text-[#a33b49]`}
                  disabled={isProcessing}
                  onClick={() => remove(index)}
                  title={t('admin.updates.photos.remove', { number: index + 1 })}
                  type="button"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[1rem]">
                    close
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {remaining > 0 ? (
        <input
          accept="image/jpeg,image/png,image/webp"
          aria-label={t('admin.updates.photos.add')}
          className="w-full rounded-[0.95rem] border border-[#d8e5ec] bg-white px-4 py-3 text-[0.95rem] text-[#14324d] file:mr-3 file:rounded-full file:border-0 file:bg-[#eef6fb] file:px-3 file:py-2 file:text-[0.8rem] file:font-semibold file:text-[#115b82]"
          disabled={isProcessing}
          multiple
          onChange={(event) => void handleChange(event)}
          type="file"
        />
      ) : null}

      <p className="text-[0.84rem] leading-[1.6] text-[#5d6d78]">
        {isProcessing
          ? t('admin.images.optimizing')
          : t('admin.updates.photos.help', { current: photos.length, max: maxPhotos })}
      </p>
    </div>
  )
}

export default AdminPhotoListInput
