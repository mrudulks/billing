import { describe, expect, it } from 'vitest'
import type { Entry, Item } from '../db/types'
import { buildEntries, clampQty, draftCount, draftTotal, groupEntriesByDate, quantitiesFromLastDay } from './entries'

const tea: Item = { id: 1, name: 'Tea', defaultPrice: 1200, active: 1 }
const vada: Item = { id: 2, name: 'Vada', defaultPrice: 1550, active: 1 }

const entry = (id: number, date: string, itemId: number, qty: number, unitPrice = 1000): Entry => ({
  id,
  customerId: 7,
  date,
  itemId,
  itemName: itemId === 1 ? 'Tea' : 'Vada',
  unitPrice,
  qty,
})

describe('clampQty', () => {
  it('keeps whole numbers between 0 and 999', () => {
    expect(clampQty(-2)).toBe(0)
    expect(clampQty(3.7)).toBe(3)
    expect(clampQty(5000)).toBe(999)
    expect(clampQty(Number.NaN)).toBe(0)
  })
})

describe('draftTotal / draftCount', () => {
  it('adds up price × qty in paise', () => {
    expect(draftTotal([tea, vada], { 1: 5, 2: 2 })).toBe(5 * 1200 + 2 * 1550)
    expect(draftTotal([tea, vada], {})).toBe(0)
    expect(draftCount({ 1: 5, 2: 2 })).toBe(7)
  })
})

describe('buildEntries', () => {
  it('copies name and price, skips zero quantities', () => {
    expect(buildEntries(7, '2026-09-28', [tea, vada], { 1: 3, 2: 0 })).toEqual([
      { customerId: 7, date: '2026-09-28', itemId: 1, itemName: 'Tea', unitPrice: 1200, qty: 3 },
    ])
  })
})

describe('groupEntriesByDate', () => {
  it('puts newest day first with day totals', () => {
    const days = groupEntriesByDate([entry(1, '2026-09-26', 1, 2), entry(3, '2026-09-28', 2, 1), entry(2, '2026-09-28', 1, 4)])
    expect(days.map((d) => d.date)).toEqual(['2026-09-28', '2026-09-26'])
    expect(days[0].entries.map((e) => e.id)).toEqual([2, 3])
    expect(days[0].total).toBe(5000)
  })
})

describe('quantitiesFromLastDay', () => {
  it('copies the most recent day, adding repeats of the same item', () => {
    const entries = [entry(1, '2026-09-26', 1, 9), entry(2, '2026-09-27', 1, 3), entry(3, '2026-09-27', 1, 2), entry(4, '2026-09-27', 2, 1)]
    expect(quantitiesFromLastDay(entries, [1, 2], '2026-09-28')).toEqual({ date: '2026-09-27', qtys: { 1: 5, 2: 1 } })
  })

  it('ignores the day being entered and later days', () => {
    const entries = [entry(1, '2026-09-26', 1, 9), entry(2, '2026-09-27', 1, 3), entry(3, '2026-09-28', 2, 1)]
    expect(quantitiesFromLastDay(entries, [1, 2], '2026-09-27')).toEqual({ date: '2026-09-26', qtys: { 1: 9 } })
  })

  it('skips hidden items and returns null when nothing is left', () => {
    expect(quantitiesFromLastDay([entry(1, '2026-09-27', 2, 1)], [1], '2026-09-28')).toBeNull()
    expect(quantitiesFromLastDay([], [1], '2026-09-28')).toBeNull()
  })
})
