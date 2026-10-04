import { supabase } from '../utils/supabase'
import { readStorage, writeStorage, removeStorage } from './safeStorage'

export type ExecutiveMember = {
  id: string
  name: string
  role: string
  email: string | null
  phone: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  created_at: string | null
}

const executivesStorageKey = 'alokayon_executive_members_cache'

export const getCachedExecutiveMembers = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const cachedValue = readStorage(executivesStorageKey)

  if (!cachedValue) {
    return null
  }

  try {
    return JSON.parse(cachedValue) as ExecutiveMember[]
  } catch {
    removeStorage(executivesStorageKey)
    return null
  }
}

export const cacheExecutiveMembers = (members: ExecutiveMember[]) => {
  if (typeof window === 'undefined') {
    return
  }

  writeStorage(executivesStorageKey, JSON.stringify(members))
}

export const invalidateExecutiveRowsCache = () => {
  if (typeof window !== 'undefined') {
    removeStorage(executivesStorageKey)
  }
}

export const loadExecutiveMembers = async () => {
  const { data, error } = await supabase
    .from('executive_members')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  const allRows = (data ?? []) as ExecutiveMember[]
  const rows = allRows.filter((row) => row.is_active && row.name && row.role)
  cacheExecutiveMembers(rows)
  // hasAnyRows tells "the admin hid everything" (show nothing) apart from "nothing has been
  // added yet" (show the built-in example content).
  return { rows, hasAnyRows: allRows.length > 0 }
}
