import { describe, expect, it } from 'vitest'
import { addDays, dayLabel, formatDisplayDate, isISODate, lastNDaysRange, parseISODate, relativeDayName, toISODate } from './dates'

describe('isISODate', () => {
  it('accepts only real YYYY-MM-DD dates', () => {
    expect(isISODate('2026-09-28')).toBe(true)
    expect(isISODate('2026-02-30')).toBe(false)
    expect(isISODate('28/09/2026')).toBe(false)
    expect(isISODate(null)).toBe(false)
  })
})

describe('relativeDayName', () => {
  it('names today, yesterday, else the weekday', () => {
    expect(relativeDayName('2026-09-28', '2026-09-28')).toBe('Today')
    expect(relativeDayName('2026-09-27', '2026-09-28')).toBe('Yesterday')
    expect(relativeDayName('2026-09-25', '2026-09-28')).toBe('Friday')
  })
})

describe('dayLabel', () => {
  it('names today and yesterday, else weekday and date', () => {
    expect(dayLabel('2026-09-28', '2026-09-28')).toBe('Today')
    expect(dayLabel('2026-09-27', '2026-09-28')).toBe('Yesterday')
    expect(dayLabel('2026-09-25', '2026-09-28')).toBe('Fri 25/09/2026')
  })
})

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
