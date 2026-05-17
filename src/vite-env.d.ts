/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_SUPABASE_MAGAZINE_BUCKET: string
  readonly VITE_SUPABASE_EXECUTIVE_BUCKET: string
  readonly VITE_SUPABASE_GALLERY_BUCKET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
