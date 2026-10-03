const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp']

// Anything larger than this after compression is rejected before upload.
export const maxImageUploadBytes = 8 * 1024 * 1024

export const isSupportedImage = (file: File) => supportedImageTypes.includes(file.type)

export const formatFileSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

type CompressImageOptions = {
  maxDimension: number
  quality?: number
}

// Resizes a photo in the browser so large camera images never reach the public site.
// Returns the original file when it is already small enough or the browser cannot process it.
export const compressImage = async (
  file: File,
  { maxDimension, quality = 0.82 }: CompressImageOptions,
): Promise<File> => {
  if (!isSupportedImage(file)) {
    return file
  }

  let bitmap: ImageBitmap

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    return file
  }

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    bitmap.close()
    return file
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  // PNGs may have transparency (logos), so keep an alpha-capable format for them.
  const outputType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg'
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality))

  if (!blob || blob.type !== outputType || (scale === 1 && blob.size >= file.size)) {
    return file
  }

  const extension = outputType === 'image/webp' ? 'webp' : 'jpg'
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'

  return new File([blob], `${baseName}.${extension}`, {
    type: outputType,
    lastModified: Date.now(),
  })
}
