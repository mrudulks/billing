import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isISODate, todayISO } from '../lib/dates'

const LAST_CUSTOMER_KEY = 'entry.lastCustomerId'

function readLastCustomer(): number | undefined {
  try {
    const value = Number(localStorage.getItem(LAST_CUSTOMER_KEY))
    return value > 0 ? value : undefined
  } catch {
    return undefined
  }
}

function writeLastCustomer(id: number) {
  try {
    localStorage.setItem(LAST_CUSTOMER_KEY, String(id))
  } catch {
    // Remembering the customer is only a convenience.
  }
}

/**
 * Chosen customer and date for the entry screen, kept in the URL (?customer=3&date=2026-09-28)
 * so links from other screens work. Falls back to the last customer used and today.
 */
export function useEntrySelection() {
  const [params, setParams] = useSearchParams()
  const fromUrl = Number(params.get('customer'))
  const customerId = fromUrl > 0 ? fromUrl : readLastCustomer()
  const dateParam = params.get('date')
  const date = isISODate(dateParam) ? dateParam : todayISO()

  const update = useCallback(
    (next: { customerId?: number; date?: string }) => {
      const id = next.customerId ?? customerId
      const d = next.date ?? date
      if (next.customerId) writeLastCustomer(next.customerId)
      const search = new URLSearchParams()
      if (id) search.set('customer', String(id))
      if (d !== todayISO()) search.set('date', d)
      setParams(search, { replace: true })
    },
    [customerId, date, setParams],
  )

  const setCustomerId = useCallback((id: number) => update({ customerId: id }), [update])
  const setDate = useCallback((d: string) => update({ date: d }), [update])

  return { customerId, date, setCustomerId, setDate }
}
