// Dates are stored as local 'YYYY-MM-DD' strings. Never use toISOString() here:
// it converts to UTC and can shift the day (e.g. just after midnight in India).

const pad = (n: number) => String(n).padStart(2, '0')

/** Local calendar date of a Date object as 'YYYY-MM-DD'. */
export function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function todayISO(): string {
  return toISODate(new Date())
}

/** 'YYYY-MM-DD' → local Date at midnight. */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** '2026-09-28' → '28/09/2026' */
export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function addDays(iso: string, days: number): string {
  const d = parseISODate(iso)
  return toISODate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days))
}

export function isISODate(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return toISODate(parseISODate(value)) === value
}

const weekday = new Intl.DateTimeFormat('en-IN', { weekday: 'short' })
const weekdayLong = new Intl.DateTimeFormat('en-IN', { weekday: 'long' })

/** 'Today', 'Yesterday', otherwise the weekday, e.g. 'Friday'. */
export function relativeDayName(iso: string, today: string = todayISO()): string {
  if (iso === today) return 'Today'
  if (iso === addDays(today, -1)) return 'Yesterday'
  return weekdayLong.format(parseISODate(iso))
}

/** 'Today', 'Yesterday', otherwise e.g. 'Fri 25/09/2026'. */
export function dayLabel(iso: string, today: string = todayISO()): string {
  if (iso === today) return 'Today'
  if (iso === addDays(today, -1)) return 'Yesterday'
  return `${weekday.format(parseISODate(iso))} ${formatDisplayDate(iso)}`
}

/** The last `n` days including `today`, e.g. n=14 → 13 days ago to today. */
export function lastNDaysRange(n: number, today: string = todayISO()): { fromDate: string; toDate: string } {
  return { fromDate: addDays(today, -(n - 1)), toDate: today }
}
