import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  compressImage,
  formatFileSize,
  isSupportedImage,
  maxImageUploadBytes,
} from '../../lib/imageCompression'

type AdminImageInputProps = {
  file: File | null
  currentImageUrl?: string | null
  alt: string
  maxDimension: number
  inputClassName: string
  previewClassName?: string
  onChange: (file: File | null) => void
  onError: (message: string) => void
}

// File picker that shrinks the chosen photo right away and shows exactly what will be uploaded.
function AdminImageInput({
  file,
  currentImageUrl,
  alt,
  maxDimension,
  inputClassName,
  previewClassName = 'h-32 w-full max-w-[14rem] object-cover',
  onChange,
  onError,
}: AdminImageInputProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // The parent clears `file` when a form is reset or saved, so clear the native input too.
  useEffect(() => {
    if (!file && inputRef.current) {
      inputRef.current.value = ''
    }
  }, [file])

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    },
    [],
  )

  const replacePreview = (nextFile: File | null) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const nextUrl = nextFile ? URL.createObjectURL(nextFile) : null
    previewUrlRef.current = nextUrl
    setPreviewUrl(nextUrl)
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null

    if (!selectedFile) {
      replacePreview(null)
      setOriginalSize(null)
      onChange(null)
      return
    }

    if (!isSupportedImage(selectedFile)) {
      event.target.value = ''
      replacePreview(null)
      setOriginalSize(null)
      onChange(null)
      onError(t('admin.images.unsupportedType'))
      return
    }

    setIsProcessing(true)
    const optimizedFile = await compressImage(selectedFile, { maxDimension })
    setIsProcessing(false)

    if (optimizedFile.size > maxImageUploadBytes) {
      event.target.value = ''
      replacePreview(null)
      setOriginalSize(null)
      onChange(null)
      onError(t('admin.errors.fileTooLarge'))
      return
    }

    replacePreview(optimizedFile)
    setOriginalSize(selectedFile.size)
    onChange(optimizedFile)
  }

  const displayUrl = file ? previewUrl : currentImageUrl

  return (
    <div className="space-y-3">
      <input
        accept="image/jpeg,image/png,image/webp"
        className={inputClassName}
        disabled={isProcessing}
        onChange={(event) => void handleChange(event)}
        ref={inputRef}
        type="file"
      />

      {isProcessing ? (
        <p className="text-[0.84rem] leading-[1.6] text-[#627581]">{t('admin.images.optimizing')}</p>
      ) : null}

      {displayUrl ? (
        <div className="flex flex-wrap items-end gap-4">
          <img
            alt={alt}
            className={`rounded-[0.9rem] border border-[#dbe7ee] bg-[#eef6fb] ${previewClassName}`}
            decoding="async"
            loading="lazy"
            src={displayUrl}
          />
          <div className="space-y-1 text-[0.84rem] leading-[1.6] text-[#627581]">
            <p className="font-semibold text-[#14324d]">
              {file ? t('admin.images.newImage') : t('admin.images.currentImage')}
            </p>
            {file && originalSize ? (
              <p>
                {originalSize > file.size
                  ? t('admin.images.optimizedSize', {
                      from: formatFileSize(originalSize),
                      to: formatFileSize(file.size),
                    })
                  : formatFileSize(file.size)}
              </p>
            ) : null}
            {file ? (
              <button
                className="font-semibold text-[#a33b49] transition hover:text-[#7f2734]"
                onClick={() => {
                  replacePreview(null)
                  setOriginalSize(null)
                  onChange(null)
                }}
                type="button"
              >
                {t('admin.images.removeSelection')}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AdminImageInput
