export const downloadFile = async (url: string, filename?: string) => {
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
}
