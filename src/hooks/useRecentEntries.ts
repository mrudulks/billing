import { useLiveQuery } from 'dexie-react-hooks'
import { listRecentEntries } from '../db/entries'
import type { Entry } from '../db/types'

const none: Entry[] = []

/** undefined while loading; empty when no customer is chosen. */
export function useRecentEntries(customerId: number | undefined) {
  return useLiveQuery(async () => (customerId === undefined ? none : listRecentEntries(customerId)), [customerId])
}
