import type { Entry, Item } from '../db/types'

export type NewEntry = Omit<Entry, 'id'>
/** Quantity typed on the entry screen, by item id. */
export type Quantities = Record<number, number>

export const MAX_QTY = 999

export function clampQty(qty: number): number {
  if (!Number.isFinite(qty) || qty < 0) return 0
  return Math.min(Math.floor(qty), MAX_QTY)
}

export function lineAmount(unitPrice: number, qty: number): number {
  return unitPrice * qty
}

/** Total in paise of what is on the entry screen right now. */
export function draftTotal(items: Item[], qtys: Quantities): number {
  return items.reduce((sum, item) => sum + lineAmount(item.defaultPrice, qtys[item.id] ?? 0), 0)
}

export function draftCount(qtys: Quantities): number {
  return Object.values(qtys).reduce((sum, qty) => sum + qty, 0)
}

/** One entry per item with a quantity. Name and price are copied so later changes never alter old bills. */
export function buildEntries(customerId: number, date: string, items: Item[], qtys: Quantities): NewEntry[] {
  return items
    .filter((item) => (qtys[item.id] ?? 0) > 0)
    .map((item) => ({
      customerId,
      date,
      itemId: item.id,
      itemName: item.name,
      unitPrice: item.defaultPrice,
      qty: qtys[item.id],
    }))
}

export interface EntryDay {
  date: string
  entries: Entry[]
  total: number
}

/** Newest day first; entries within a day in the order they were saved. */
export function groupEntriesByDate(entries: Entry[]): EntryDay[] {
  const byDate = new Map<string, Entry[]>()
  for (const entry of entries) {
    const list = byDate.get(entry.date) ?? []
    list.push(entry)
    byDate.set(entry.date, list)
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? 1 : a > b ? -1 : 0))
    .map(([date, list]) => {
      const sorted = [...list].sort((a, b) => a.id - b.id)
      return { date, entries: sorted, total: sorted.reduce((sum, e) => sum + lineAmount(e.unitPrice, e.qty), 0) }
    })
}

/**
 * Quantities from the customer's most recent day before `beforeDate`, for "Same as last time".
 * Only items still shown on the entry screen are copied; prices come from the current item list.
 */
export function quantitiesFromLastDay(
  entries: Entry[],
  activeItemIds: number[],
  beforeDate: string,
): { date: string; qtys: Quantities } | null {
  const lastDay = groupEntriesByDate(entries).find((day) => day.date < beforeDate)
  if (!lastDay) return null
  const active = new Set(activeItemIds)
  const qtys: Quantities = {}
  for (const entry of lastDay.entries) {
    if (active.has(entry.itemId)) qtys[entry.itemId] = clampQty((qtys[entry.itemId] ?? 0) + entry.qty)
  }
  return Object.keys(qtys).length > 0 ? { date: lastDay.date, qtys } : null
}
