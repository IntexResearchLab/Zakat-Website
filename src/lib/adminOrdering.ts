import { supabase } from '../utils/supabase'
import { requireChangedRows } from './adminErrors'

type OrderedRow = {
  id: string
  sort_order: number
}

type OrderedTable = 'gallery_items' | 'executive_members' | 'campaigns'

// Swaps an item with its neighbour and renumbers the whole list 1..n, so duplicate
// or gappy sort_order values left by older edits are cleaned up at the same time.
export const moveAndRenumber = <T extends OrderedRow>(items: T[], id: string, direction: -1 | 1) => {
  const index = items.findIndex((item) => item.id === id)
  const targetIndex = index + direction

  if (index === -1 || targetIndex < 0 || targetIndex >= items.length) {
    return { nextItems: items, changedRows: [] as T[] }
  }

  const reordered = [...items]
  ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]

  const nextItems = reordered.map((item, position) => ({ ...item, sort_order: position + 1 }))
  const changedRows = nextItems.filter(
    (item) => items.find((original) => original.id === item.id)?.sort_order !== item.sort_order,
  )

  return { nextItems, changedRows }
}

export const persistSortOrder = async (table: OrderedTable, rows: OrderedRow[]) => {
  const results = await Promise.all(
    rows.map((row) =>
      supabase.from(table).update({ sort_order: row.sort_order }).eq('id', row.id).select('id'),
    ),
  )

  return results.map(requireChangedRows).find(Boolean) ?? null
}

export const setRowVisibility = async (table: OrderedTable, id: string, isActive: boolean) => {
  return requireChangedRows(
    await supabase.from(table).update({ is_active: isActive }).eq('id', id).select('id'),
  )
}
