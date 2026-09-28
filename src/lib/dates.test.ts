import { describe, expect, it } from 'vitest'
import { addDays, formatDisplayDate, lastNDaysRange, parseISODate, toISODate } from './dates'

describe('toISODate', () => {
  it('uses local date parts, not UTC', () => {
    // 00:30 local time must stay on the same calendar day
    expect(toISODate(new Date(2026, 8, 28, 0, 30))).toBe('2026-09-28')
    expect(toISODate(new Date(2026, 8, 28, 23, 59))).toBe('2026-09-28')
  })
})

describe('parseISODate', () => {
  it('round-trips', () => {
    expect(toISODate(parseISODate('2026-01-05'))).toBe('2026-01-05')
  })
})

describe('formatDisplayDate', () => {
  it('shows DD/MM/YYYY', () => {
    expect(formatDisplayDate('2026-09-28')).toBe('28/09/2026')
    expect(formatDisplayDate('2026-01-05')).toBe('05/01/2026')
  })
})

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-09-30', 1)).toBe('2026-10-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(addDays('2028-03-01', -1)).toBe('2028-02-29')
  })
})

describe('lastNDaysRange', () => {
  it('includes today', () => {
    expect(lastNDaysRange(14, '2026-09-28')).toEqual({ fromDate: '2026-09-15', toDate: '2026-09-28' })
    expect(lastNDaysRange(1, '2026-09-28')).toEqual({ fromDate: '2026-09-28', toDate: '2026-09-28' })
  })
})
