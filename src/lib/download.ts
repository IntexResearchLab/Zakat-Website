// Saves a file with a friendly name. Fetching it as a blob is needed because browsers ignore
// the download attribute on links to another domain (the PDFs live in Supabase storage).
// If that fails, for example on a network or CORS error, the file opens in a new tab instead
// so the visitor still gets it.
export const downloadFile = async (url: string, filename?: string) => {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`)
    }

    const blob = await response.blob()
    const objectUrl = window.URL.createObjectURL(blob)
    const link = window.document.createElement('a')

    link.href = objectUrl
    link.download = filename || url.split('/').pop() || 'download'
    window.document.body.appendChild(link)
    link.click()
    window.document.body.removeChild(link)
    window.URL.revokeObjectURL(objectUrl)
  } catch (error) {
    console.error('[download]', error)
    window.open(url, '_blank', 'noopener')
  }
}
