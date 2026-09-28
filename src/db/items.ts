import type { CleanItem } from '../lib/itemValidation'
import { db } from './db'
import type { Item } from './types'

export async function listItems(): Promise<Item[]> {
  const items = await db.items.toArray()
  return items.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
}

export function addItem(item: CleanItem): Promise<number> {
  return db.items.add({ ...item, active: 1 })
}

export async function updateItem(id: number, item: CleanItem & { active: 0 | 1 }): Promise<void> {
  await db.items.update(id, item)
}

export function countItemUses(itemId: number): Promise<number> {
  return db.entries.filter((entry) => entry.itemId === itemId).count()
}

/** Only deletes items never used in an entry. Returns false if it is in use. */
export async function deleteItemIfUnused(itemId: number): Promise<boolean> {
  return db.transaction('rw', [db.items, db.entries, db.customerPrices], async () => {
    if ((await countItemUses(itemId)) > 0) return false
    await db.customerPrices.filter((price) => price.itemId === itemId).delete()
    await db.items.delete(itemId)
    return true
  })
}
