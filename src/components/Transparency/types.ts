export type MagazineIssue = {
  id: string
  year: string
  title: string
  description: string
  pdfUrl: string
  coverImageUrl: string | null
  sections: string[]
}

export type TransparencyDocument = {
  title: string
  description: string
  icon: string
}
