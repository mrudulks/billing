import Dexie from 'dexie'
import type { NewEntry } from '../lib/entries'
import { db } from './db'
import type { Entry } from './types'

// Enough for about two weeks of daily deliveries.
const RECENT_LIMIT = 80

export async function addEntries(entries: NewEntry[]): Promise<void> {
  await db.transaction('rw', db.entries, () => db.entries.bulkAdd(entries))
}

/** Customer's latest entries, newest date first. */
export function listRecentEntries(customerId: number): Promise<Entry[]> {
  return db.entries
    .where('[customerId+date]')
    .between([customerId, Dexie.minKey], [customerId, Dexie.maxKey])
    .reverse()
    .limit(RECENT_LIMIT)
    .toArray()
}

/** Entries already on a bill are never deleted. Returns false in that case. */
export async function deleteEntryIfUnbilled(id: number): Promise<boolean> {
  return db.transaction('rw', db.entries, async () => {
    const entry = await db.entries.get(id)
    if (!entry) return true
    if (entry.billId !== undefined) return false
    await db.entries.delete(id)
    return true
  })
}
