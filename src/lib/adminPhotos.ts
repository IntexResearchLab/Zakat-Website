// A photo already saved (its public link) or one picked in the admin form and not yet uploaded.
export type AdminPhoto =
  | { kind: 'saved'; key: string; url: string }
  | { kind: 'new'; key: string; file: File; previewUrl: string }

let nextPhotoKey = 0

export const savedPhotos = (urls: string[]): AdminPhoto[] =>
  urls.map((url) => ({ kind: 'saved', key: url, url }))

export const newPhoto = (file: File): AdminPhoto => {
  nextPhotoKey += 1
  return { kind: 'new', key: `new-${nextPhotoKey}`, file, previewUrl: URL.createObjectURL(file) }
}

// Frees the in-memory previews of photos that were picked but never saved.
export const releasePhotoPreviews = (photos: AdminPhoto[]) => {
  for (const photo of photos) {
    if (photo.kind === 'new') {
      URL.revokeObjectURL(photo.previewUrl)
    }
  }
}
