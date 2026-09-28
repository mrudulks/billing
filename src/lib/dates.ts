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

/** The last `n` days including `today`, e.g. n=14 → 13 days ago to today. */
export function lastNDaysRange(n: number, today: string = todayISO()): { fromDate: string; toDate: string } {
  return { fromDate: addDays(today, -(n - 1)), toDate: today }
}
