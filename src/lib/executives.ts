import { supabase } from '../utils/supabase'

export type ExecutiveMember = {
  id: string
  name: string
  role: string
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
  created_at: string | null
}

const executivesStorageKey = 'alokayon_executive_members_cache'

export const getCachedExecutiveMembers = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const cachedValue = window.localStorage.getItem(executivesStorageKey)

  if (!cachedValue) {
    return null
  }

  try {
    return JSON.parse(cachedValue) as ExecutiveMember[]
  } catch {
    window.localStorage.removeItem(executivesStorageKey)
    return null
  }
}

export const cacheExecutiveMembers = (members: ExecutiveMember[]) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(executivesStorageKey, JSON.stringify(members))
}

export const invalidateExecutiveRowsCache = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(executivesStorageKey)
  }
}

export const loadExecutiveMembers = async () => {
  const { data, error } = await supabase
    .from('executive_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  const rows = ((data ?? []) as ExecutiveMember[]).filter((row) => row.name && row.role)
  cacheExecutiveMembers(rows)
  return rows
}
